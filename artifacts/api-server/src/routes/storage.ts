import { Router, type IRouter, type Request, type Response } from "express";
import { RequestUploadUrlBody } from "@workspace/api-zod";
import { getCloudinaryUploadParams } from "../lib/cloudinaryService";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.post("/storage/uploads/request-url", requireAuth, async (req: Request, res: Response) => {
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const { uploadURL, uploadParams } = getCloudinaryUploadParams();

    res.json({
      uploadURL,
      uploadParams,
      metadata: { name, size, contentType },
    });
  } catch (error) {
    req.log.error({ err: error }, "Error generating Cloudinary upload params");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

export default router;
