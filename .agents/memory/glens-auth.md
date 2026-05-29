---
name: Glens Residential Auth Setup
description: Session-based staff authentication — packages, seeding, and session config.
---

Staff login uses `express-session` + `connect-pg-simple` (pg session store, `createTableIfMissing: true`). Password hashing via `bcrypt`.

**Default credentials seeded on first boot:** username `admin`, password `glens2025` (only if no staff users exist in DB).

**Why:** Small care home, no external auth provider needed. Sessions persist across restarts via DB store.

**How to apply:** If adding more staff users, insert directly into `staff_users` table with a bcrypt-hashed password. The seed in `artifacts/api-server/src/lib/seed.ts` only runs once (when table is empty).

Session type augmentation lives in `artifacts/api-server/src/types/session.d.ts` — TypeScript picks it up via tsconfig include, but do NOT import it as a module (esbuild will fail). It is a declaration-only file.
