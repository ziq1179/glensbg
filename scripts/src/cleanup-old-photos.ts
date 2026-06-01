import pg from "pg";

const rawUrl = process.env.NEON_DATABASE_URL;
if (!rawUrl) {
  console.error("NEON_DATABASE_URL is not set");
  process.exit(1);
}

// Strip psql '...' wrapper if present
const connectionString = rawUrl.replace(/^psql\s+'/, "").replace(/'$/, "");

const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });

await client.connect();

// Show what will be deleted
const preview = await client.query(
  "SELECT id, section, label, object_path FROM site_photos WHERE object_path LIKE '/objects/%' ORDER BY id"
);

if (preview.rows.length === 0) {
  console.log("No stale /objects/ photos found in production. Nothing to delete.");
  await client.end();
  process.exit(0);
}

console.log(`Found ${preview.rows.length} stale photo(s) to delete:`);
for (const row of preview.rows) {
  console.log(`  id=${row.id} section=${row.section} label=${row.label} path=${row.object_path}`);
}

const result = await client.query(
  "DELETE FROM site_photos WHERE object_path LIKE '/objects/%' RETURNING id"
);

console.log(`\nDeleted ${result.rowCount} row(s) from site_photos.`);

await client.end();
