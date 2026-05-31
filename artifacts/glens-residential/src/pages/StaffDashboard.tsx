import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { usePhotos, type SitePhoto } from "@/hooks/usePhotos";
import { useSettings } from "@/hooks/useSettings";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Upload,
  Trash2,
  ImageIcon,
  Home,
  Utensils,
  Users,
  TreePine,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Phone,
  MapPin,
  Save,
  Facebook,
  Instagram,
  Twitter,
  Star,
  Palette,
} from "lucide-react";
import type { ThemeColor } from "@/hooks/useSettings";

const SECTIONS = [
  {
    id: "home-hero",
    label: "Home Page — Hero",
    description: "Main banner image on the homepage",
    icon: Home,
  },
  {
    id: "life-dining",
    label: "Life at the Glens — Dining",
    description: "Dining room / meal time photos",
    icon: Utensils,
  },
  {
    id: "life-activities",
    label: "Life at the Glens — Activities",
    description: "Activities, events, and day-to-day life",
    icon: TreePine,
  },
  {
    id: "team",
    label: "Meet the Team",
    description: "Staff and management photos",
    icon: Users,
  },
];

function PhotoUploader({
  section,
  onUploaded,
}: {
  section: string;
  onUploaded: () => void;
}) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max file size is 10MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const paramsRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!paramsRes.ok) throw new Error("Failed to get upload parameters");
      const { uploadURL, uploadParams } = await paramsRes.json();

      const formData = new FormData();
      formData.append("file", file);
      for (const [key, value] of Object.entries(uploadParams as Record<string, string>)) {
        formData.append(key, value);
      }

      const uploadRes = await fetch(uploadURL, { method: "POST", body: formData });
      if (!uploadRes.ok) throw new Error("Upload to Cloudinary failed");
      const uploadData = await uploadRes.json() as { secure_url: string };
      const objectPath = uploadData.secure_url;

      const saveRes = await fetch("/api/photos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ section, label: file.name, objectPath }),
      });
      if (!saveRes.ok) throw new Error("Failed to save photo record");

      toast({ title: "Photo uploaded", description: `${file.name} is now live on the website.` });
      onUploaded();
    } catch (e: unknown) {
      toast({
        title: "Upload failed",
        description: e instanceof Error ? e.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f) handleFile(f); }}
      onClick={() => {
        if (uploading) return;
        const inp = document.createElement("input");
        inp.type = "file";
        inp.accept = "image/*";
        inp.onchange = () => { if (inp.files?.[0]) handleFile(inp.files[0]); };
        inp.click();
      }}
      data-testid={`upload-zone-${section}`}
      className={`
        flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer
        transition-all duration-200 select-none text-center
        ${uploading ? "opacity-60 cursor-not-allowed" : ""}
        ${dragOver ? "border-primary bg-primary/10 scale-[1.01]" : "border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5"}
      `}
    >
      {uploading ? (
        <Loader2 size={28} className="animate-spin text-primary" />
      ) : (
        <Upload size={28} className={dragOver ? "text-primary" : "text-muted-foreground"} />
      )}
      <p className="text-sm font-medium text-foreground">
        {uploading ? "Uploading…" : dragOver ? "Drop to upload" : "Drag & drop or click to upload"}
      </p>
      <p className="text-xs text-muted-foreground">JPG, PNG, WEBP — max 10MB</p>
    </div>
  );
}

function resolvePhotoUrl(objectPath: string): string {
  if (objectPath.startsWith("http://") || objectPath.startsWith("https://")) {
    return objectPath;
  }
  return `/api/storage${objectPath}`;
}

function PhotoCard({ photo, onDelete }: { photo: SitePhoto; onDelete: () => void }) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const imgUrl = resolvePhotoUrl(photo.objectPath);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/photos/${photo.id}`, { method: "DELETE", credentials: "include" });
      toast({ title: "Photo removed", description: "The photo has been deleted." });
      onDelete();
    } catch {
      toast({ title: "Delete failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="relative group rounded-xl overflow-hidden border border-border bg-card shadow-sm"
      data-testid={`photo-card-${photo.id}`}
    >
      <img
        src={imgUrl}
        alt={photo.label}
        className="w-full aspect-video object-cover"
      />
      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-sm font-medium truncate text-foreground">{photo.label}</p>
          <p className="text-xs text-muted-foreground">
            Uploaded by {photo.uploadedBy} · {new Date(photo.createdAt).toLocaleDateString("en-GB")}
          </p>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="shrink-0 text-muted-foreground hover:text-destructive"
          onClick={handleDelete}
          disabled={deleting}
          data-testid={`button-delete-photo-${photo.id}`}
        >
          {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </Button>
      </div>
    </motion.div>
  );
}

function SectionPanel({ section }: { section: (typeof SECTIONS)[number] }) {
  const { photos, loading, reload } = usePhotos(section.id);

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-2.5 rounded-full text-primary shrink-0">
            <section.icon size={20} />
          </div>
          <div className="min-w-0">
            <h3 className="font-serif font-bold text-lg text-foreground leading-tight">{section.label}</h3>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </div>
          {photos.length > 0 && (
            <Badge className="ml-auto shrink-0 bg-primary/10 text-primary border-0">
              {photos.length} {photos.length === 1 ? "photo" : "photos"}
            </Badge>
          )}
        </div>

        <PhotoUploader section={section.id} onUploaded={reload} />

        {loading ? null : (
          <AnimatePresence>
            {photos.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {photos.map((p) => (
                  <PhotoCard key={p.id} photo={p} onDelete={reload} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {!loading && photos.length === 0 && (
          <p className="text-center text-sm text-muted-foreground mt-4 py-2">
            No photos yet for this section.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ContactDetailsEditor() {
  const { settings, save } = useSettings();
  const { toast } = useToast();
  const [phone, setPhone] = useState(settings.phone);
  const [address, setAddress] = useState(settings.address);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPhone(settings.phone);
    setAddress(settings.address);
  }, [settings.phone, settings.address]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({ phone: phone.trim(), address: address.trim() });
      toast({ title: "Contact details saved", description: "The website phone number and address have been updated." });
    } catch (e) {
      toast({ title: "Failed to save", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = phone.trim() !== settings.phone || address.trim() !== settings.address;

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Phone size={14} className="text-primary" />
              Phone Number
            </label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="028 2177 1396"
              className="bg-background font-medium"
              data-testid="input-phone"
            />
            <p className="text-xs text-muted-foreground">Shown in the navbar, footer, and contact page.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <MapPin size={14} className="text-primary" />
              Address
            </label>
            <Textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={"63 Middlepark Road\nCushendall, Ballymena\nBT44 0SQ"}
              className="bg-background resize-none"
              rows={3}
              data-testid="input-address"
            />
            <p className="text-xs text-muted-foreground">Each line break becomes a new line on the website. Shown in the footer and contact page.</p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-full"
            data-testid="button-save-contact"
          >
            {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SocialLinksEditor() {
  const { settings, save } = useSettings();
  const { toast } = useToast();
  const [facebook, setFacebook] = useState(settings.facebook);
  const [instagram, setInstagram] = useState(settings.instagram);
  const [twitter, setTwitter] = useState(settings.twitter);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFacebook(settings.facebook);
    setInstagram(settings.instagram);
    setTwitter(settings.twitter);
  }, [settings.facebook, settings.instagram, settings.twitter]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({
        facebook: facebook.trim(),
        instagram: instagram.trim(),
        twitter: twitter.trim(),
      });
      toast({ title: "Social links saved", description: "The footer social media links have been updated." });
    } catch (e) {
      toast({ title: "Failed to save", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    facebook.trim() !== settings.facebook ||
    instagram.trim() !== settings.instagram ||
    twitter.trim() !== settings.twitter;

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Facebook size={14} className="text-primary" />
              Facebook URL
            </label>
            <Input
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder="https://www.facebook.com/YourPage"
              className="bg-background"
              data-testid="input-facebook"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Instagram size={14} className="text-primary" />
              Instagram URL
            </label>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="https://www.instagram.com/YourHandle"
              className="bg-background"
              data-testid="input-instagram"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Twitter size={14} className="text-primary" />
              X (Twitter) URL
            </label>
            <Input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="https://x.com/YourHandle"
              className="bg-background"
              data-testid="input-twitter"
            />
          </div>

          <p className="text-xs text-muted-foreground">
            Leave a field blank to hide that icon from the footer. Paste the full URL to your profile page.
          </p>

          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-full"
            data-testid="button-save-social"
          >
            {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
            {saving ? "Saving…" : "Save Links"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const THEMES: { id: ThemeColor; label: string; description: string; primary: string; bg: string; accent: string }[] = [
  {
    id: "green",
    label: "Original Green",
    description: "Warm sage green — the current website palette",
    primary: "#6b9e7a",
    bg: "#f8f5ec",
    accent: "#5a8bae",
  },
  {
    id: "navy",
    label: "Navy Blue",
    description: "Deep navy blue with a gold accent",
    primary: "#1e3a8a",
    bg: "#f5f8fc",
    accent: "#d97706",
  },
];

function ThemePicker() {
  const { settings, save } = useSettings();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const handleSelect = async (theme: ThemeColor) => {
    if (theme === settings.theme) return;
    setSaving(true);
    try {
      await save({ theme });
      toast({ title: "Theme updated", description: `Switched to the ${theme === "navy" ? "Navy Blue" : "Original Green"} theme.` });
    } catch (e) {
      toast({ title: "Failed to save", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {THEMES.map((t) => {
        const active = settings.theme === t.id;
        return (
          <button
            key={t.id}
            onClick={() => handleSelect(t.id)}
            disabled={saving}
            className={[
              "relative text-left rounded-2xl border-2 p-5 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "border-primary shadow-md"
                : "border-border hover:border-muted-foreground/40 hover:shadow-sm",
            ].join(" ")}
          >
            {active && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-semibold text-primary">
                <CheckCircle size={13} className="fill-primary/20" /> Active
              </span>
            )}
            <div className="flex gap-2 mb-3">
              <div className="w-8 h-8 rounded-full border border-border/40 shadow-sm" style={{ background: t.bg }} />
              <div className="w-8 h-8 rounded-full border border-border/40 shadow-sm" style={{ background: t.primary }} />
              <div className="w-8 h-8 rounded-full border border-border/40 shadow-sm" style={{ background: t.accent }} />
            </div>
            <p className="font-semibold text-foreground text-sm">{t.label}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>
          </button>
        );
      })}
    </div>
  );
}

function ReviewUrlEditor() {
  const { settings, save } = useSettings();
  const { toast } = useToast();
  const [reviewUrl, setReviewUrl] = useState(settings.review_url);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setReviewUrl(settings.review_url);
  }, [settings.review_url]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await save({ review_url: reviewUrl.trim() });
      toast({ title: "Review link saved", description: "The QR code and review button have been updated on the website." });
    } catch (e) {
      toast({ title: "Failed to save", description: e instanceof Error ? e.message : "Unknown error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = reviewUrl.trim() !== settings.review_url;

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
              <Star size={14} className="text-primary" />
              Google Reviews or Trustpilot URL
            </label>
            <Input
              value={reviewUrl}
              onChange={(e) => setReviewUrl(e.target.value)}
              placeholder="https://g.page/r/your-business/review  or  https://www.trustpilot.com/review/..."
              className="bg-background"
              data-testid="input-review-url"
            />
            <p className="text-xs text-muted-foreground">
              Paste the link where families can leave a review. A QR code and button will appear on the Contact page automatically. Leave blank to hide it.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="rounded-full"
            data-testid="button-save-review-url"
          >
            {saving ? <Loader2 size={14} className="mr-1.5 animate-spin" /> : <Save size={14} className="mr-1.5" />}
            {saving ? "Saving…" : "Save Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StaffDashboard() {
  const [, setLocation] = useLocation();
  const { user, loading, logout } = useStaffAuth();

  useEffect(() => {
    if (!loading && !user) {
      setLocation("/staff/login");
    }
  }, [user, loading, setLocation]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    setLocation("/staff/login");
  };

  return (
    <>
      <SEO title="Staff Dashboard" description="Staff photo management portal for Glens Residential Home." />

      <div className="bg-muted/30 border-b border-border py-8">
        <div className="container mx-auto px-4 max-w-5xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2.5 rounded-full text-primary">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-foreground">Staff Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Signed in as <span className="font-medium text-foreground">{user.displayName}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-sm text-primary bg-primary/10 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} />
              Active session
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full"
              data-testid="button-logout"
            >
              <LogOut size={14} className="mr-1.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <section className="py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon size={20} className="text-primary" />
            <h2 className="text-xl font-serif font-bold text-foreground">Site Photos</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Upload photos for each section below. The most recent photo for each section will appear on the public website. Deleting a photo reverts to the default image.
          </p>

          <div className="grid gap-6">
            {SECTIONS.map((section) => (
              <SectionPanel key={section.id} section={section} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <Palette size={20} className="text-primary" />
            <h2 className="text-xl font-serif font-bold text-foreground">Website Theme</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Choose the colour palette for the entire website. The change takes effect immediately for all visitors.
          </p>
          <ThemePicker />
        </div>
      </section>

      <section className="py-10 border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <Phone size={20} className="text-primary" />
            <h2 className="text-xl font-serif font-bold text-foreground">Contact Details</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Update the phone number and address shown across the website — navbar, footer, and contact page.
          </p>
          <div className="max-w-lg">
            <ContactDetailsEditor />
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-border">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <Facebook size={20} className="text-primary" />
            <h2 className="text-xl font-serif font-bold text-foreground">Social Media Links</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Paste the full URL to each social profile. The icon will appear in the footer automatically. Leave blank to hide it.
          </p>
          <div className="max-w-lg">
            <SocialLinksEditor />
          </div>
        </div>
      </section>

      <section className="py-10 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center gap-2 mb-2">
            <Star size={20} className="text-primary" />
            <h2 className="text-xl font-serif font-bold text-foreground">Review Link & QR Code</h2>
          </div>
          <p className="text-muted-foreground mb-8">
            Add your Google Reviews or Trustpilot link. A "Leave a Review" button and scannable QR code will appear on the Contact page for families to use.
          </p>
          <div className="max-w-lg">
            <ReviewUrlEditor />
          </div>
        </div>
      </section>
    </>
  );
}
