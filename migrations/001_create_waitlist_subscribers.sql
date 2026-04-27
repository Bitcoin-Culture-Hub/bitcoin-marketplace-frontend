CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS waitlist_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source_site TEXT NOT NULL,
  source_page TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  welcome_sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT waitlist_subscribers_email_source_site_unique
    UNIQUE (email, source_site)
);

-- Safe path for an older waitlist_subscribers table that used global email
-- uniqueness:
-- 1. Keep existing rows and add the new source columns.
-- 2. Backfill old rows as bitcoin-marketplace / unknown.
-- 3. Drop the old waitlist_subscribers_email_key constraint.
-- 4. Add uniqueness on (email, source_site).
ALTER TABLE waitlist_subscribers
  ADD COLUMN IF NOT EXISTS source_site TEXT;

UPDATE waitlist_subscribers
SET source_site = 'bitcoin-marketplace'
WHERE source_site IS NULL;

ALTER TABLE waitlist_subscribers
  ALTER COLUMN source_site SET NOT NULL;

ALTER TABLE waitlist_subscribers
  ADD COLUMN IF NOT EXISTS source_page TEXT;

UPDATE waitlist_subscribers
SET source_page = 'unknown'
WHERE source_page IS NULL;

ALTER TABLE waitlist_subscribers
  ALTER COLUMN source_page SET NOT NULL;

ALTER TABLE waitlist_subscribers
  ADD COLUMN IF NOT EXISTS referrer TEXT,
  ADD COLUMN IF NOT EXISTS user_agent TEXT,
  ADD COLUMN IF NOT EXISTS welcome_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE waitlist_subscribers
  DROP CONSTRAINT IF EXISTS waitlist_subscribers_email_key;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'waitlist_subscribers_email_source_site_unique'
  ) THEN
    ALTER TABLE waitlist_subscribers
      ADD CONSTRAINT waitlist_subscribers_email_source_site_unique
      UNIQUE (email, source_site);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS waitlist_subscribers_source_site_idx
  ON waitlist_subscribers (source_site);

CREATE INDEX IF NOT EXISTS waitlist_subscribers_created_at_idx
  ON waitlist_subscribers (created_at DESC);
