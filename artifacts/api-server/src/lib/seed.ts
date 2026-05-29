import bcrypt from "bcrypt";
import { db, staffUsersTable } from "@workspace/db";
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
