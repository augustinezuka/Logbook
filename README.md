# Logbook

A multi-tenant revenue & expense logbook. Each company that signs up gets its own
isolated set of data — revenue entries (from games or other sources) and expense
entries (each with a required reason).

**Stack:** Next.js 16 (App Router), Drizzle ORM, PostgreSQL, Auth.js v5 (credentials
login), Tailwind CSS v4.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Set up a PostgreSQL database (local, Supabase, Neon, Railway — any Postgres works).

3. Copy the env file and fill it in:

   ```bash
   cp .env.example .env
   ```

   - `DATABASE_URL` — your Postgres connection string
   - `AUTH_SECRET` — generate with `npx auth secret`

4. Push the schema to your database:

   ```bash
   npx drizzle-kit push
   ```

5. Run the dev server:

   ```bash
   npm run dev
   ```

6. Visit `http://localhost:3000`, click **Create your company**, and sign up. That
   creates a new organization and makes you its owner — every revenue/expense entry
   you add is scoped to that organization only.

## How multi-tenancy works

- Signing up creates a row in `organizations` plus a `users` row (role: `owner`)
  linked to it.
- Every `revenue_entries` and `expense_entries` row carries an `organization_id`.
- All reads/writes in `lib/actions.ts` filter by the logged-in user's
  `organizationId` (from the session), so one company can never see another's data.
- The owner can add teammates from **Members** — this creates a new `users` row
  with the same `organizationId` and role `member`, with a temporary password the
  owner shares directly (no email sending is wired up). Only the owner can add or
  remove members.

## Design

Ledger/indie-studio look: parchment background with a dot grid, a serif display
face (Fraunces) for headlines, monospace (JetBrains Mono) for every dollar figure,
and a "ledger tape" card style with perforated top/bottom edges. Adding revenue or
an expense happens in a dialog rather than a full page, and the overview page has a
6-month revenue-vs-expenses bar chart (via `recharts`).

## Project structure

- `lib/db/schema.ts` — Drizzle schema (organizations, users, revenue_entries, expense_entries)
- `lib/auth.ts` — Auth.js config (credentials provider, JWT session with org/role)
- `lib/actions.ts` — server actions for sign-up and revenue/expense CRUD
- `app/dashboard/` — overview, revenue, and expenses pages
- `middleware.ts` — redirects unauthenticated users away from `/dashboard`

## Deploying

Works well on Vercel. Add `DATABASE_URL` and `AUTH_SECRET` as environment variables,
then run `npx drizzle-kit push` against your production database once before first
deploy (or wire up `drizzle-kit migrate` in your CI).
