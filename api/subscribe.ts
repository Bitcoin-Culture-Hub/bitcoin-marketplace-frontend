import { SendEmailCommand, SESv2Client } from "@aws-sdk/client-sesv2";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";
import postgres from "postgres";

const SUCCESS_RESPONSE = {
  ok: true,
  message: "Subscribed successfully",
} as const;

const DEFAULT_ALLOWED_SOURCE_SITES = [
  "houseofnaka",
  "bitcoin-marketplace",
  "bitcoin-culture-hub",
  "bitcoin-for-collectors",
  "bitcoin-for-startups",
  "bitcoin-for-talent",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_RAW_BODY_BYTES = 16 * 1024;

const SOURCE_SITE_EMAILS = {
  houseofnaka: {
    displayName: "House of Naka",
    subject: "Welcome to House of Naka",
  },
  "bitcoin-marketplace": {
    displayName: "Bitcoin Culture Hub Marketplace",
    subject: "Welcome to Bitcoin Culture Hub Marketplace",
  },
  "bitcoin-culture-hub": {
    displayName: "Bitcoin Culture Hub",
    subject: "Welcome to Bitcoin Culture Hub",
  },
  "bitcoin-for-collectors": {
    displayName: "Bitcoin for Collectors",
    subject: "Welcome to Bitcoin for Collectors",
  },
  "bitcoin-for-startups": {
    displayName: "Bitcoin for Startups",
    subject: "Welcome to Bitcoin for Startups",
  },
  "bitcoin-for-talent": {
    displayName: "Bitcoin for Talent",
    subject: "Welcome to Bitcoin for Talent",
  },
} as const satisfies Record<
  (typeof DEFAULT_ALLOWED_SOURCE_SITES)[number],
  { displayName: string; subject: string }
>;

type SourceSite = keyof typeof SOURCE_SITE_EMAILS;

type SubscribeRequest = IncomingMessage & {
  body?: unknown;
};

type SubscribeBody = {
  email?: unknown;
  sourceSite?: unknown;
  sourcePage?: unknown;
};

type InsertedSubscriber = {
  id: string;
  email: string;
  source_site: SourceSite;
};

type JsonObject = {
  [key: string]: JsonValue;
};

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];

class RequestError extends Error {
  readonly statusCode: number;
  readonly safeMessage: string;

  constructor(statusCode: number, safeMessage: string) {
    super(safeMessage);
    this.name = "RequestError";
    this.statusCode = statusCode;
    this.safeMessage = safeMessage;
  }
}

type SqlClient = ReturnType<typeof postgres>;

let sqlClient: SqlClient | null = null;
let sesClient: SESv2Client | null = null;

function sendJson(response: ServerResponse, statusCode: number, body: JsonObject): void {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseJsonString(rawBody: string): unknown {
  if (!rawBody.trim()) {
    throw new RequestError(400, "Request body must be valid JSON.");
  }

  try {
    return JSON.parse(rawBody) as unknown;
  } catch {
    throw new RequestError(400, "Request body must be valid JSON.");
  }
}

function readRawBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let receivedBytes = 0;

    request.on("data", (chunk: Buffer | string) => {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      receivedBytes += buffer.byteLength;

      if (receivedBytes > MAX_RAW_BODY_BYTES) {
        reject(new RequestError(400, "Request body is too large."));
        request.destroy();
        return;
      }

      chunks.push(buffer);
    });

    request.on("end", () => {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    request.on("error", () => {
      reject(new RequestError(400, "Could not read request body."));
    });
  });
}

async function readJsonBody(request: SubscribeRequest): Promise<unknown> {
  if (request.body !== undefined) {
    if (typeof request.body === "string") {
      return parseJsonString(request.body);
    }

    if (Buffer.isBuffer(request.body)) {
      return parseJsonString(request.body.toString("utf8"));
    }

    return request.body;
  }

  return parseJsonString(await readRawBody(request));
}

function normalizeEmail(value: unknown): string {
  if (typeof value !== "string") {
    throw new RequestError(400, "Please enter a valid email.");
  }

  const email = value.trim().toLowerCase();

  if (!EMAIL_PATTERN.test(email)) {
    throw new RequestError(400, "Please enter a valid email.");
  }

  return email;
}

function isSourceSite(value: string): value is SourceSite {
  return Object.prototype.hasOwnProperty.call(SOURCE_SITE_EMAILS, value);
}

function getAllowedSourceSites(): ReadonlySet<SourceSite> {
  const configuredAllowlist = process.env.WAITLIST_ALLOWED_SOURCE_SITES;

  if (!configuredAllowlist?.trim()) {
    return new Set(DEFAULT_ALLOWED_SOURCE_SITES);
  }

  const configured = configuredAllowlist
    .split(",")
    .map((site) => site.trim().toLowerCase())
    .filter((site): site is SourceSite => isSourceSite(site));

  return new Set(configured);
}

function normalizeSourceSite(value: unknown): SourceSite {
  if (typeof value !== "string") {
    throw new RequestError(400, "Invalid source site.");
  }

  const sourceSite = value.trim().toLowerCase();

  if (!isSourceSite(sourceSite) || !getAllowedSourceSites().has(sourceSite)) {
    throw new RequestError(400, "Invalid source site.");
  }

  return sourceSite;
}

function normalizeSourcePage(value: unknown): string {
  if (typeof value !== "string") {
    return "unknown";
  }

  const sourcePage = value.trim();
  return sourcePage || "unknown";
}

function headerValue(headers: IncomingHttpHeaders, name: string): string | null {
  const value = headers[name];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function getSqlClient(): SqlClient {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new RequestError(500, "Subscription service is not configured.");
  }

  if (!sqlClient) {
    sqlClient = postgres(databaseUrl, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }

  return sqlClient;
}

function getSesClient(): SESv2Client {
  const region = process.env.SES_REGION || process.env.AWS_REGION;

  if (!region) {
    throw new RequestError(500, "Subscription service is not configured.");
  }

  if (!sesClient) {
    sesClient = new SESv2Client({ region });
  }

  return sesClient;
}

function getSesFromEmail(): string {
  const fromEmail = process.env.SES_FROM_EMAIL?.trim();

  if (!fromEmail) {
    throw new RequestError(500, "Subscription service is not configured.");
  }

  return fromEmail;
}

function buildWelcomeEmail(sourceSite: SourceSite): {
  subject: string;
  text: string;
  html: string;
} {
  const site = SOURCE_SITE_EMAILS[sourceSite];
  const text = [
    `Welcome to ${site.displayName}.`,
    "",
    "Thanks for joining the waitlist. We'll send occasional updates when there is something useful to share.",
    "",
    "Bitcoin Culture Hub",
  ].join("\n");

  const html = [
    "<!doctype html>",
    '<html lang="en">',
    "<body>",
    `<p>Welcome to ${site.displayName}.</p>`,
    "<p>Thanks for joining the waitlist. We'll send occasional updates when there is something useful to share.</p>",
    "<p>Bitcoin Culture Hub</p>",
    "</body>",
    "</html>",
  ].join("");

  return {
    subject: site.subject,
    text,
    html,
  };
}

async function sendWelcomeEmail(email: string, sourceSite: SourceSite): Promise<void> {
  const fromEmail = getSesFromEmail();
  const replyToEmail = process.env.SES_REPLY_TO_EMAIL?.trim();
  const content = buildWelcomeEmail(sourceSite);

  await getSesClient().send(
    new SendEmailCommand({
      FromEmailAddress: fromEmail,
      Destination: {
        ToAddresses: [email],
      },
      ReplyToAddresses: replyToEmail ? [replyToEmail] : undefined,
      Content: {
        Simple: {
          Subject: {
            Data: content.subject,
          },
          Body: {
            Text: {
              Data: content.text,
            },
            Html: {
              Data: content.html,
            },
          },
        },
      },
    })
  );
}

async function insertSubscriber(input: {
  email: string;
  sourceSite: SourceSite;
  sourcePage: string;
  referrer: string | null;
  userAgent: string | null;
}): Promise<InsertedSubscriber | null> {
  const sql = getSqlClient();
  const rows = await sql<InsertedSubscriber[]>`
    INSERT INTO waitlist_subscribers (
      email,
      source_site,
      source_page,
      referrer,
      user_agent
    )
    VALUES (
      ${input.email},
      ${input.sourceSite},
      ${input.sourcePage},
      ${input.referrer},
      ${input.userAgent}
    )
    ON CONFLICT (email, source_site) DO NOTHING
    RETURNING id, email, source_site
  `;

  return rows[0] ?? null;
}

async function markWelcomeEmailSent(id: string): Promise<void> {
  const sql = getSqlClient();

  await sql`
    UPDATE waitlist_subscribers
    SET welcome_sent_at = NOW(),
        updated_at = NOW()
    WHERE id = ${id}
      AND welcome_sent_at IS NULL
  `;
}

async function handleSubscribe(request: SubscribeRequest): Promise<void> {
  const body = await readJsonBody(request);

  if (!isRecord(body)) {
    throw new RequestError(400, "Request body must be valid JSON.");
  }

  const subscribeBody: SubscribeBody = body;
  const email = normalizeEmail(subscribeBody.email);
  const sourceSite = normalizeSourceSite(subscribeBody.sourceSite);
  const sourcePage = normalizeSourcePage(subscribeBody.sourcePage);
  const referrer =
    headerValue(request.headers, "referer") ??
    headerValue(request.headers, "referrer");
  const userAgent = headerValue(request.headers, "user-agent");

  const subscriber = await insertSubscriber({
    email,
    sourceSite,
    sourcePage,
    referrer,
    userAgent,
  });

  if (!subscriber) {
    return;
  }

  await sendWelcomeEmail(subscriber.email, subscriber.source_site);
  await markWelcomeEmailSent(subscriber.id);
}

export default async function handler(
  request: SubscribeRequest,
  response: ServerResponse
): Promise<void> {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    sendJson(response, 405, {
      ok: false,
      message: "Method not allowed.",
    });
    return;
  }

  try {
    await handleSubscribe(request);
    sendJson(response, 200, SUCCESS_RESPONSE);
  } catch (error) {
    if (error instanceof RequestError) {
      sendJson(response, error.statusCode, {
        ok: false,
        message: error.safeMessage,
      });
      return;
    }

    console.error("Subscribe API failed.", error);
    sendJson(response, 500, {
      ok: false,
      message: "Subscription service is temporarily unavailable.",
    });
  }
}
