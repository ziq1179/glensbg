---
name: Cloudinary Photo Storage
description: Replaced Replit GCS Object Storage with Cloudinary for environment-agnostic uploads. Covers signing, URL resolution, and backward compat.
---

# Cloudinary Photo Storage

## The rule
Photo uploads now go directly from the browser to Cloudinary. The `objectPath` column in `site_photos` stores the full Cloudinary `secure_url` (e.g. `https://res.cloudinary.com/...`) for new uploads.

**Why:** Replit Object Storage uses a localhost sidecar (port 1106) and env vars that don't exist on Render, so uploads failed silently on the live site.

## How to apply
- Signing: `artifacts/api-server/src/lib/cloudinaryService.ts` — SHA-1 of sorted `key=value` pairs + API secret (standard Cloudinary v1 signature). Reads `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` at call time. Must be set in Render env too.
- Upload endpoint: `POST /api/storage/uploads/request-url` returns `{ uploadURL, uploadParams }`. Frontend POSTs multipart FormData to `uploadURL` (Cloudinary), reads `secure_url` from the response.
- URL resolution: `resolvePhotoUrl(objectPath)` in both `StaffDashboard.tsx` and `useSectionPhoto.ts` — if `objectPath` starts with `http`, use directly; otherwise prefix with `/api/storage` (backward compat for old /objects/... rows).
- Old GCS proxy routes removed. Old `/objects/...` rows in DB will 404 on Render (staff should re-upload).
