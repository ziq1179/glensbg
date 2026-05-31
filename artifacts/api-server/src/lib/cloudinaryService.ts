import { v2 as cloudinary } from "cloudinary";
import { createHash } from "crypto";

const FOLDER = "glens-residential";

function getConfig() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }
  return { cloud_name, api_key, api_secret };
}

export function getCloudinaryUploadParams(): {
  uploadURL: string;
  uploadParams: Record<string, string | number>;
} {
  const { cloud_name, api_key, api_secret } = getConfig();

  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = { folder: FOLDER, timestamp };

  const sortedKeys = Object.keys(paramsToSign).sort();
  const paramString = sortedKeys
    .map((k) => `${k}=${paramsToSign[k as keyof typeof paramsToSign]}`)
    .join("&");

  const signature = createHash("sha1")
    .update(paramString + api_secret)
    .digest("hex");

  return {
    uploadURL: `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
    uploadParams: {
      api_key,
      timestamp,
      signature,
      folder: FOLDER,
    },
  };
}
