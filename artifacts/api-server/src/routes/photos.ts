import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, sitePhotosTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/photos", async (req, res): Promise<void> => {
  const section = typeof req.query.section === "string" ? req.query.section : undefined;

  const rows = section
    ? await db
        .select()
        .from(sitePhotosTable)
        .where(eq(sitePhotosTable.section, section))
        .orderBy(desc(sitePhotosTable.createdAt))
    : await db
        .select()
        .from(sitePhotosTable)
        .orderBy(desc(sitePhotosTable.createdAt));

  res.json(rows);
});

const SavePhotoBody = z.object({
  section: z.string().min(1),
  label: z.string().min(1),
  objectPath: z.string().min(1),
});

router.post("/photos", requireAuth, async (req, res): Promise<void> => {
  const parsed = SavePhotoBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { section, label, objectPath } = parsed.data;
  const uploadedBy = req.session.staffUser!.displayName;

  const [photo] = await db
    .insert(sitePhotosTable)
    .values({ section, label, objectPath, uploadedBy })
    .returning();

  req.log.info({ section, uploadedBy }, "Photo saved");
  res.status(201).json(photo);
});

router.delete("/photos/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(sitePhotosTable)
    .where(eq(sitePhotosTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Photo not found" });
    return;
  }

  req.log.info({ id }, "Photo deleted");
  res.sendStatus(204);
});

export default router;
