# Subscribe Serverless Smoke Test

The footer Subscribe flow is handled inside this Vercel frontend project:

Footer Subscribe form -> `POST /api/subscribe` -> Neon `waitlist_subscribers` -> Amazon SES welcome email.

It does not call the Medusa backend and does not require a Medusa-migrated database for waitlist testing.

## Automated Checks

- `npm run check:subscribe` verifies the Subscribe API contract without network calls.
- `npm run build` verifies the Vite production bundle.
- `npx tsc --noEmit` verifies TypeScript.
- `npx eslint vite.config.ts src/components/layout/Footer.tsx src/services/store.api.ts api/subscribe.ts` verifies the touched source files.

## Environment

Set these in Vercel and in local serverless development:

```sh
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
SES_REGION=us-east-1
AWS_REGION=us-east-1
SES_FROM_EMAIL=noreply@example.com
SES_REPLY_TO_EMAIL=hello@example.com
WAITLIST_ALLOWED_SOURCE_SITES=houseofnaka,bitcoin-marketplace,bitcoin-culture-hub,bitcoin-for-collectors,bitcoin-for-startups,bitcoin-for-talent
```

If the runtime is not already authenticated to AWS, also configure AWS credentials as server-only Vercel environment variables. Do not prefix database, AWS, or SES secrets with `VITE_`.

## Database Migration

Apply `migrations/001_create_waitlist_subscribers.sql` to the Neon database before testing.

For an older `waitlist_subscribers` table with global email uniqueness, the migration preserves existing rows by backfilling:

- `source_site = 'bitcoin-marketplace'`
- `source_page = 'unknown'`

It then drops `waitlist_subscribers_email_key` and adds `UNIQUE (email, source_site)` so the same email can subscribe to different source sites.

## Manual Smoke Test

1. Apply the SQL migration to Neon.
2. Set Vercel/local env: `DATABASE_URL`, `SES_REGION` or `AWS_REGION`, `SES_FROM_EMAIL`, optional `SES_REPLY_TO_EMAIL`, and `WAITLIST_ALLOWED_SOURCE_SITES`.
3. In terminal 1, start Vercel serverless functions on port 3000:

   ```sh
   npx vercel dev --listen 3000
   ```

4. In terminal 2, start Vite:

   ```sh
   npm run dev
   ```

5. Open the Vite URL printed by the dev server, for example `http://localhost:8081`.
6. Submit a valid email from the marketplace footer.
7. Check the Network tab for `POST /api/subscribe`.
8. Confirm the request succeeds. In local Vite dev, `/api` is proxied to `http://localhost:3000`; this proxy is local-dev only and does not affect production builds.
9. Verify one Neon row exists for `email` + `source_site = 'bitcoin-marketplace'` + `source_page = 'homepage-footer'`.
10. Submit the same email again from the same footer and verify no second same-site row is inserted.
11. Submit the same email with a different allowlisted `sourceSite` through a controlled API request and verify a separate row is inserted.
12. Verify SES success sets `welcome_sent_at`.
13. Simulate an SES rejection, then verify the row remains and `welcome_sent_at` stays null.

## SES Sandbox

Amazon SES sandbox accounts can only send to verified recipients or simulator addresses. Use a verified test recipient or SES simulator address until the SES account is out of sandbox.
