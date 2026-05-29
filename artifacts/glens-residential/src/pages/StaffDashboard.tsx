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
} from "lucide-react";

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
      const urlRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!urlRes.ok) throw new Error("Failed to get upload URL");
      const { uploadURL, objectPath } = await urlRes.json();

      const uploadRes = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Upload to storage failed");

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

function PhotoCard({ photo, onDelete }: { photo: SitePhoto; onDelete: () => void }) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);
  const imgUrl = `/api/storage${photo.objectPath}`;

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
    </>
  );
}
