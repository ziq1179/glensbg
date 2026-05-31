# Glens Residential

Website for Glens Residential Care Home — allows staff to manage photos and site settings, with a public-facing frontend.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes to the dev (Replit) database
- `pnpm --filter @workspace/db run push:production` — push DB schema changes to the Neon production database (requires `NEON_DATABASE_URL` secret)
- Required env: `DATABASE_URL` — Postgres connection string (Replit-managed dev DB)
- Required secret: `NEON_DATABASE_URL` — Neon production database connection string (for Render deployment)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/db/src/schema/` — source of truth for all DB tables (staff_users, site_settings, site_photos)
- `lib/db/drizzle.config.ts` — Drizzle Kit config (reads DATABASE_URL)
- `artifacts/api-server/src/` — Express API routes, auth middleware, seed
- `artifacts/glens-residential/` — React + Vite frontend
- `lib/api-spec/` — OpenAPI spec (source of truth for API contract)

## Architecture decisions

- Session auth via `express-session` + `connect-pg-simple`; `session` table is auto-created on first boot (`createTableIfMissing: true`)
- Default staff user (`admin` / `glens2025`) is seeded on first boot when `staff_users` is empty
- Production DB is Neon (PostgreSQL); dev DB is Replit-managed PostgreSQL
- Object storage via Replit GCS bucket for photo uploads
- `NEON_DATABASE_URL` is stored as a Replit secret and used only for schema pushes and Render deployment

## Render production configuration

The live API service (`glensbg`, `srv-d8e0us77f7vs73cmqnrg`) has the following env vars set directly on Render:

| Variable | Value |
|---|---|
| `DATABASE_URL` | The bare `postgresql://...` Neon connection string (extracted from `NEON_DATABASE_URL` by stripping the `psql '...'` wrapper) |
| `SESSION_SECRET` | Strong random value (base64, 48 bytes) — stored in Replit secrets as `SESSION_SECRET` |

These are set via the Render dashboard / API and are **not** committed to the repo. `NODE_ENV=production` is set by the Render runtime. The `session` table is auto-created by `connect-pg-simple` (`createTableIfMissing: true`) on first boot. The admin user and default `site_settings` rows are seeded in Neon from a prior task.

## Product

Staff can log in, manage site photos (upload/delete by section), and edit contact settings. The public frontend displays the care home's information and gallery.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- `NEON_DATABASE_URL` secret was originally pasted as a `psql '...'` command — the raw URL must be extracted with `sed "s/^psql '//;s/'$//"` if re-pasted in that format. Render needs the bare `postgresql://...` string.
- `connect-pg-simple` + esbuild: esbuild rebases `__dirname` to `dist/`, so `table.sql` must be copied into `dist/` in `build.mjs`
- Always call `req.session.save()` before responding after login — without it, the session write races the next request
- `pnpm run push:production` uses `NEON_DATABASE_URL`; `pnpm run push` uses `DATABASE_URL` (dev)

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
