# Postcard

Digital postcard exchange. Compose a message with an optional background image, send it to a friend's email, they open it at a link — no signup.

Phase 1 (this build): compose → send → view. No accounts, no library yet — each postcard is a standalone link.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in:
   - `DATABASE_URL` — a Neon Postgres connection string
   - `RESEND_API_KEY` / `EMAIL_FROM` — Resend
   - `BLOB_READ_WRITE_TOKEN` — Vercel Blob (only needed for local dev; auto-injected on Vercel)
3. Run `schema.sql` against your database (Neon SQL Editor, or `psql $DATABASE_URL -f schema.sql`)
4. `npm run dev`

## Not built yet (see plan)

- Magic-link auth + personal inbox/library of sent & received postcards (Phase 2)
- Reply flow
- Visual polish / transitions (Phase 3)
