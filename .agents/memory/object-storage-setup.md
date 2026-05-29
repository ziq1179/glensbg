---
name: Object Storage Setup
description: GCS object storage provisioned; known api-zod duplicate export fix.
---

Object storage bucket provisioned via `setupObjectStorage()`. Env vars set: `DEFAULT_OBJECT_STORAGE_BUCKET_ID`, `PUBLIC_OBJECT_SEARCH_PATHS`, `PRIVATE_OBJECT_DIR`.

**Duplicate export fix:** Orval generates both `lib/api-zod/src/generated/api.ts` (Zod schemas) and `lib/api-zod/src/generated/types/*.ts` (TS interfaces) with the same export names. `lib/api-zod/src/index.ts` was updated to `export * from "./generated/api"` only, plus `export type { HealthStatus } from "./generated/types"` for the one type only in the types directory.

**Why:** `export * from "./generated/api"; export * from "./generated/types"` causes TS2308 duplicate export errors when both directories export the same schema names.

**React overrides:** Root `package.json` has `pnpm.overrides` pinning `react` and `react-dom` to `19.1.0` to prevent Uppy v5 (which declares `react>=19` peer dep) from pulling a duplicate React version.
