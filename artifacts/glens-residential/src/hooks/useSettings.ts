import { useState, useEffect } from "react";

export interface SiteSettings {
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  review_url: string;
}

const DEFAULTS: SiteSettings = {
  phone: "028 2177 1396",
  address: "63 Middlepark Road\nCushendall, Ballymena\nBT44 0SQ",
  facebook: "",
  instagram: "",
  twitter: "",
  review_url: "",
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = () => {
    fetch("/api/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data) setSettings({ ...DEFAULTS, ...data }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const save = async (values: Partial<SiteSettings>) => {
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Failed to save settings");
    }
    const updated = await res.json();
    setSettings((prev) => ({ ...prev, ...updated }));
    return updated as SiteSettings;
  };

  return { settings, loading, save, reload: load };
}
