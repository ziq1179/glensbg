import { useState, useEffect } from "react";

export function useSectionPhoto(section: string, fallback: string): string {
  const [src, setSrc] = useState(fallback);

  useEffect(() => {
    fetch(`/api/photos?section=${encodeURIComponent(section)}`)
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Array<{ objectPath: string }>) => {
        if (rows.length > 0) {
          setSrc(`/api/storage${rows[0].objectPath}`);
        }
      })
      .catch(() => {});
  }, [section]);

  return src;
}
