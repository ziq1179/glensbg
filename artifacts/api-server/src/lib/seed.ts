import bcrypt from "bcrypt";
import { db, staffUsersTable, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { logger } from "./logger";

export async function seedStaffUsers(): Promise<void> {
  const existing = await db.select().from(staffUsersTable).limit(1);
  if (existing.length > 0) return;

  const passwordHash = await bcrypt.hash("glens2025", 12);
  await db.insert(staffUsersTable).values({
    username: "admin",
    passwordHash,
    displayName: "Admin Staff",
  });

  logger.info("Default staff user created — username: admin  password: glens2025");
}

const DEFAULT_SETTINGS: Array<{ key: string; value: string }> = [
  { key: "phone", value: "028 2177 1396" },
  { key: "address", value: "63 Middlepark Road\nCushendall, Ballymena\nBT44 0SQ" },
];

export async function seedSiteSettings(): Promise<void> {
  for (const { key, value } of DEFAULT_SETTINGS) {
    const existing = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, key))
      .limit(1);
    if (existing.length === 0) {
      await db.insert(siteSettingsTable).values({ key, value });
    }
  }
}
