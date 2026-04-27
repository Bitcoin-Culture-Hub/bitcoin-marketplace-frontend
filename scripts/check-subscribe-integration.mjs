import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

const root = process.cwd()
const readProjectFile = (filePath) => readFileSync(resolve(root, filePath), "utf8")

const storeApi = readProjectFile("src/services/store.api.ts")
const footer = readProjectFile("src/components/layout/Footer.tsx")
const serverlessApi = readProjectFile("api/subscribe.ts")
const viteConfig = readProjectFile("vite.config.ts")
const envExample = readProjectFile(".env.example")
const migration = readProjectFile("migrations/001_create_waitlist_subscribers.sql")

const checks = []

function check(name, assertion) {
  assertion()
  checks.push(name)
}

function includes(source, value, message) {
  assert.ok(source.includes(value), message)
}

function excludes(source, value, message) {
  assert.ok(!source.includes(value), message)
}

function matches(source, pattern, message) {
  assert.match(source, pattern, message)
}

function extractFunction(source, name) {
  const start = source.indexOf(`export async function ${name}`)
  assert.notEqual(start, -1, `${name} must exist.`)
  const nextExport = source.indexOf("\nexport ", start + 1)
  return source.slice(start, nextExport === -1 ? source.length : nextExport)
}

const subscribeHelper = extractFunction(storeApi, "subscribeToWaitlist")
const frontendFiles = `${storeApi}\n${footer}`
const serverOnlyEnvPattern = /DATABASE_URL|AWS_|SES_/
const realSecretPattern =
  /AKIA[0-9A-Z]{16}|aws_secret_access_key|postgres(?:ql)?:\/\/[^:\s]+:[^@\s]+@/i
const legacySubscribePath = ["/store", "subscribe"].join("/")
const legacyPublishableHeader = ["x", "publishable", "api", "key"].join("-")

check("subscribe browser helper posts only to /api/subscribe", () => {
  includes(subscribeHelper, 'fetch("/api/subscribe"', "Subscribe must call the Vercel API route.")
  includes(subscribeHelper, 'method: "POST"', "Subscribe must POST.")
  includes(subscribeHelper, '"Content-Type": "application/json"', "Subscribe must send JSON.")
  includes(subscribeHelper, "JSON.stringify(input)", "Subscribe must send the typed request body.")
  excludes(subscribeHelper, legacySubscribePath, "Subscribe must not call the legacy Medusa subscribe path.")
  excludes(subscribeHelper, "storeFetch", "Subscribe must not use the Medusa store fetch helper.")
  excludes(
    subscribeHelper,
    legacyPublishableHeader,
    "Subscribe must not require the Medusa publishable API key."
  )
})

check("vite dev proxies /api to local vercel dev", () => {
  includes(viteConfig, 'host: "::"', "Vite dev host setting should be preserved.")
  includes(viteConfig, "port: 8080", "Vite dev port setting should be preserved.")
  includes(viteConfig, "proxy:", "Vite dev server should configure a proxy.")
  includes(viteConfig, '"/api"', "Only the /api path should be proxied for serverless functions.")
  includes(viteConfig, 'target: "http://localhost:3000"', "Vite /api proxy should target local vercel dev.")
  includes(viteConfig, "changeOrigin: true", "Vite /api proxy should set changeOrigin.")
})

check("subscribe request includes email, sourceSite, and sourcePage", () => {
  includes(storeApi, "email: string", "Subscribe payload must include email.")
  includes(storeApi, "sourceSite: WaitlistSourceSite", "Subscribe payload must include sourceSite.")
  includes(storeApi, "sourcePage: string", "Subscribe payload must include sourcePage.")
  matches(
    footer,
    /await subscribeToWaitlist\(\{[\s\S]*email: trimmedEmail,[\s\S]*sourceSite: WAITLIST_SOURCE_SITE,[\s\S]*sourcePage: WAITLIST_SOURCE_PAGE/,
    "Footer must submit email, sourceSite, and sourcePage."
  )
  includes(
    footer,
    'const WAITLIST_SOURCE_SITE: WaitlistSourceSite = "bitcoin-marketplace"',
    "Footer sourceSite must be bitcoin-marketplace."
  )
  includes(
    footer,
    'const WAITLIST_SOURCE_PAGE = "homepage-footer"',
    "Footer sourcePage must identify the footer form."
  )
})

check("subscribe form validates and handles visible states", () => {
  includes(footer, 'type SubscribeState = "idle" | "loading" | "success" | "error"', "State model must include idle/loading/success/error.")
  includes(footer, "const trimmedEmail = email.trim()", "Email should be trimmed before submit.")
  matches(
    footer,
    /if \(!isValidEmail\(trimmedEmail\)\) \{[\s\S]*setMessage\(INVALID_EMAIL_MESSAGE\);[\s\S]*return;/,
    "Invalid emails must not call the API."
  )
  includes(
    footer,
    'const INVALID_EMAIL_MESSAGE = "Please enter a valid email."',
    "Invalid email copy must match the product requirement."
  )
  matches(
    footer,
    /const SUBSCRIBE_SUCCESS_MESSAGE = "You.re subscribed\."/,
    "Success copy must be the generic subscribed message."
  )
  includes(
    footer,
    'const SUBSCRIBE_ERROR_MESSAGE = "Something went wrong. Please try again."',
    "Errors must use the generic message."
  )
  includes(footer, "if (isSubmittingRef.current) return", "Rapid duplicate submits must be ignored.")
  includes(footer, "disabled={isLoading}", "Submit button must be disabled while loading.")
  includes(footer, 'aria-label="Email address"', "Email input needs an accessible name.")
  includes(footer, 'aria-label="Subscribe"', "Icon button needs an accessible label.")
  includes(footer, 'role="status"', "Feedback text should be exposed as a status.")
  includes(footer, 'aria-live="polite"', "Feedback updates should be announced.")
  assert.ok(!/already exists|duplicate/i.test(footer), "The UI must not reveal duplicate status.")
})

check("frontend files do not expose server-only env vars or secrets", () => {
  assert.ok(
    !serverOnlyEnvPattern.test(frontendFiles),
    "Frontend source must not reference DATABASE_URL, AWS_, or SES_ variables."
  )
  assert.ok(!realSecretPattern.test(frontendFiles), "Frontend source must not contain real secret-looking values.")
  excludes(envExample, "VITE_DATABASE_URL", "DATABASE_URL must not be exposed through VITE_.")
  excludes(envExample, "VITE_AWS_", "AWS variables must not be exposed through VITE_.")
  excludes(envExample, "VITE_SES_", "SES variables must not be exposed through VITE_.")
})

check("env example documents server-only subscribe configuration", () => {
  includes(envExample, "DATABASE_URL=postgresql://user:password@host/db?sslmode=require", "DATABASE_URL example is required.")
  includes(envExample, "SES_REGION=us-east-1", "SES_REGION example is required.")
  includes(envExample, "AWS_REGION=us-east-1", "AWS_REGION fallback example is required.")
  includes(envExample, "SES_FROM_EMAIL=noreply@example.com", "SES_FROM_EMAIL example is required.")
  includes(envExample, "SES_REPLY_TO_EMAIL=hello@example.com", "SES_REPLY_TO_EMAIL example is required.")
  includes(
    envExample,
    "WAITLIST_ALLOWED_SOURCE_SITES=houseofnaka,bitcoin-marketplace,bitcoin-culture-hub,bitcoin-for-collectors,bitcoin-for-startups,bitcoin-for-talent",
    "Allowed source sites example is required."
  )
})

check("serverless API validates request and source site", () => {
  includes(serverlessApi, 'if (request.method !== "POST")', "API must reject non-POST methods.")
  includes(serverlessApi, 'response.setHeader("Allow", "POST")', "405 responses must expose the allowed method.")
  includes(serverlessApi, "parseJsonString", "API must parse JSON safely.")
  includes(serverlessApi, "normalizeEmail", "API must validate and normalize email.")
  includes(serverlessApi, "value.trim().toLowerCase()", "Email/sourceSite normalization must trim and lowercase.")
  includes(serverlessApi, "WAITLIST_ALLOWED_SOURCE_SITES", "API must support source site allowlist env.")
  includes(serverlessApi, "DEFAULT_ALLOWED_SOURCE_SITES", "API must have safe default source sites.")
  includes(serverlessApi, 'return sourcePage || "unknown"', "sourcePage must default to unknown.")
})

check("serverless API writes to Neon and handles duplicates idempotently", () => {
  includes(serverlessApi, "process.env.DATABASE_URL", "API must use server-side DATABASE_URL.")
  includes(serverlessApi, "postgres(databaseUrl", "API must connect through postgres.")
  includes(
    serverlessApi,
    "ON CONFLICT (email, source_site) DO NOTHING",
    "API must use per-source duplicate handling."
  )
  excludes(serverlessApi, "ON CONFLICT(email)", "API must not use global email conflict handling.")
  includes(serverlessApi, "RETURNING id, email, source_site", "Insert must return only new rows.")
  includes(serverlessApi, "if (!subscriber)", "Duplicate same-site submissions must short-circuit.")
})

check("serverless API sends SES welcome email only after a new insert", () => {
  includes(serverlessApi, "@aws-sdk/client-sesv2", "API must use SESv2 client.")
  includes(serverlessApi, "process.env.SES_REGION || process.env.AWS_REGION", "API must use SES_REGION or AWS_REGION.")
  includes(serverlessApi, "process.env.SES_FROM_EMAIL", "API must use SES_FROM_EMAIL.")
  includes(serverlessApi, "process.env.SES_REPLY_TO_EMAIL", "API must support optional SES_REPLY_TO_EMAIL.")
  includes(serverlessApi, "await sendWelcomeEmail(subscriber.email, subscriber.source_site)", "SES must run only for inserted rows.")
  includes(serverlessApi, "welcome_sent_at = NOW()", "welcome_sent_at must be set only after SES succeeds.")
  assert.ok(
    serverlessApi.indexOf("await sendWelcomeEmail(subscriber.email, subscriber.source_site)") <
      serverlessApi.indexOf("await markWelcomeEmailSent(subscriber.id)"),
    "welcome_sent_at must be updated after SES succeeds."
  )
})

check("migration creates per-source waitlist table", () => {
  includes(migration, "CREATE EXTENSION IF NOT EXISTS pgcrypto", "Migration must enable pgcrypto.")
  includes(migration, "CREATE TABLE IF NOT EXISTS waitlist_subscribers", "Migration must create waitlist_subscribers.")
  includes(migration, "source_site TEXT NOT NULL", "Migration must include source_site.")
  includes(migration, "source_page TEXT NOT NULL", "Migration must include source_page.")
  includes(migration, "DROP CONSTRAINT IF EXISTS waitlist_subscribers_email_key", "Migration must drop old global email uniqueness.")
  includes(migration, "UNIQUE (email, source_site)", "Migration must enforce per-source uniqueness.")
  includes(migration, "waitlist_subscribers_source_site_idx", "Migration must index source_site.")
  includes(migration, "waitlist_subscribers_created_at_idx", "Migration must index created_at.")
})

for (const name of checks) {
  console.log(`ok - ${name}`)
}
