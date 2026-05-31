import { useState, useEffect } from "react";

function resolvePhotoUrl(objectPath: string): string {
  if (objectPath.startsWith("http://") || objectPath.startsWith("https://")) {
    return objectPath;
  }
  return `/api/storage${objectPath}`;
}

export function useSectionPhoto(section: string, fallback: string): string {
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    fetch(`/api/photos?section=${encodeURIComponent(section)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Array<{ objectPath: string }>) => {
        if (rows.length > 0) {
          setSrc(resolvePhotoUrl(rows[0].objectPath));
        }
      })
      .catch(() => {});
  }, [section]);

  return src;
}
