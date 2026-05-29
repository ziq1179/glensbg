import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sitePhotosTable = pgTable("site_photos", {
  id: serial("id").primaryKey(),
  section: text("section").notNull(),
  label: text("label").notNull(),
  objectPath: text("object_path").notNull(),
  uploadedBy: text("uploaded_by").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSitePhotoSchema = createInsertSchema(sitePhotosTable).omit({
  id: true,
  createdAt: true,
});
export type InsertSitePhoto = z.infer<typeof insertSitePhotoSchema>;
export type SitePhoto = typeof sitePhotosTable.$inferSelect;
