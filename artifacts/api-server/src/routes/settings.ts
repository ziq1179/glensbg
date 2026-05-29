import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, siteSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

const ALLOWED_KEYS = ["phone", "address", "facebook", "instagram", "twitter"] as const;

async function getAllSettings(): Promise<Record<string, string>> {
  const rows = await db.select().from(siteSettingsTable);
  return Object.fromEntries(rows.map((r) => [r.key, r.value]));
}

router.get("/settings", async (_req, res): Promise<void> => {
  const settings = await getAllSettings();
  res.json(settings);
});

const UpdateSettingsBody = z.object({
  phone: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

router.put("/settings", requireAuth, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates = parsed.data;

  for (const key of ALLOWED_KEYS) {
    const val = updates[key];
    if (val == null) continue;

    const existing = await db
      .select()
      .from(siteSettingsTable)
      .where(eq(siteSettingsTable.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(siteSettingsTable)
        .set({ value: val })
        .where(eq(siteSettingsTable.key, key));
    } else {
      await db.insert(siteSettingsTable).values({ key, value: val });
    }
  }

  req.log.info({ updatedBy: req.session.staffUser?.username }, "Settings updated");
  const result = await getAllSettings();
  res.json(result);
});

export default router;
