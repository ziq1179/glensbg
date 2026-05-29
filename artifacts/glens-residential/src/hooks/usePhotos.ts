import { useState, useEffect } from "react";

export interface SitePhoto {
  id: number;
  section: string;
  label: string;
  objectPath: string;
  uploadedBy: string;
  createdAt: string;
}

export function usePhotos(section?: string) {
  const [photos, setPhotos] = useState<SitePhoto[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    const url = section ? `/api/photos?section=${encodeURIComponent(section)}` : "/api/photos";
    fetch(url)
      .then((r) => r.json())
      .then(setPhotos)
      .catch(() => setPhotos([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [section]);

  const deletePhoto = async (id: number) => {
    await fetch(`/api/photos/${id}`, { method: "DELETE", credentials: "include" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return { photos, loading, reload: load, deletePhoto };
}
