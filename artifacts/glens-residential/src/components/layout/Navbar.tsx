import { Link, useLocation } from "wouter";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettings } from "@/hooks/useSettings";

function WhatsAppIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.119.554 4.107 1.523 5.83L.057 23.268a.75.75 0 00.906.918l5.687-1.49A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.713 9.713 0 01-4.964-1.362l-.355-.212-3.681.965.981-3.584-.232-.369A9.718 9.718 0 012.25 12C2.25 6.615 6.615 2.25 12 2.25S21.75 6.615 21.75 12 17.385 21.75 12 21.75z"/>
    </svg>
  );
}

function toWhatsAppUrl(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "").replace(/^0/, "44")}`;
}

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { settings } = useSettings();

  const links = [
    { href: "/", label: "Home" },
    { href: "/our-services", label: "Our Services" },
    { href: "/life-at-the-glens", label: "Life at the Glens" },
    { href: "/meet-the-team", label: "Meet the Team" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact & FAQ" },
  ];

  const phoneDigits = settings.phone.replace(/\s+/g, "");

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" data-testid="nav-logo">
          <div className="text-2xl font-serif font-bold text-primary">
            Glens <span className="text-foreground">Residential</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium transition-colors hover:text-primary ${
                location === link.href ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`nav-link-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <div className="flex items-center gap-2">
            <a
              href={`tel:${phoneDigits}`}
              className="text-primary hover:text-primary/80 font-medium flex items-center gap-2"
              data-testid="nav-phone"
            >
              <Phone size={18} />
              <span>{settings.phone}</span>
            </a>
            <a
              href={toWhatsAppUrl(settings.phone)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="text-[#25D366] hover:text-[#1ebe5d] transition-colors"
              data-testid="nav-whatsapp"
            >
              <WhatsAppIcon size={20} />
            </a>
          </div>
          <Button asChild size="lg" className="rounded-full shadow-md" data-testid="nav-book-visit">
            <Link href="/contact">Book a Visit</Link>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setIsOpen(!isOpen)}
          data-testid="nav-mobile-toggle"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium transition-colors ${
                    location === link.href ? "text-primary" : "text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-border flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <a
                    href={`tel:${phoneDigits}`}
                    className="text-primary font-medium flex items-center gap-2"
                  >
                    <Phone size={18} />
                    <span>{settings.phone}</span>
                  </a>
                  <a
                    href={toWhatsAppUrl(settings.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp"
                    className="text-[#25D366] hover:text-[#1ebe5d] transition-colors"
                  >
                    <WhatsAppIcon size={20} />
                  </a>
                </div>
                <Button asChild size="lg" className="w-full rounded-full" onClick={() => setIsOpen(false)}>
                  <Link href="/contact">Book a Visit</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
