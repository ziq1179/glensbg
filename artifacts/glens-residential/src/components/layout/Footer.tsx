import { Phone, MapPin, ExternalLink, ShieldCheck, Facebook, Instagram, Twitter } from "lucide-react";

import { Link } from "wouter";
import { useSettings } from "@/hooks/useSettings";

function WhatsAppIcon({ size = 16 }: { size?: number }) {
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

export function Footer() {
  const { settings } = useSettings();
  const phoneDigits = settings.phone.replace(/\s+/g, "");
  const addressLines = settings.address.split("\n");

  return (
    <footer className="bg-foreground text-primary-foreground py-12 lg:py-16 mt-auto">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex flex-col gap-4">
          <div className="text-2xl font-serif font-bold text-white mb-2">
            Glens <span className="text-primary-foreground/80">Residential</span>
          </div>
          <p className="text-primary-foreground/80 text-sm leading-relaxed">
            A family-run residential care home nestled in the scenic Glens of Antrim, where life is defined by dignity, belonging, and familiar faces.
          </p>
          {(settings.facebook || settings.instagram || settings.twitter) && (
            <div className="flex items-center gap-3 mt-2">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary/80 transition-colors text-primary-foreground/70 hover:text-white"
                >
                  <Facebook size={17} />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary/80 transition-colors text-primary-foreground/70 hover:text-white"
                >
                  <Instagram size={17} />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-primary-foreground/10 hover:bg-primary/80 transition-colors text-primary-foreground/70 hover:text-white"
                >
                  <Twitter size={17} />
                </a>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-serif font-bold text-lg text-white">Contact Us</h3>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${phoneDigits}`}
              className="flex items-center gap-3 text-primary-foreground/80 hover:text-white transition-colors"
              data-testid="footer-phone"
            >
              <Phone size={18} className="text-primary shrink-0" />
              <span>{settings.phone}</span>
            </a>
            <a
              href={toWhatsAppUrl(settings.phone)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="text-[#25D366] hover:text-[#1ebe5d] transition-colors shrink-0"
            >
              <WhatsAppIcon size={16} />
            </a>
          </div>
          <div className="flex items-start gap-3 text-primary-foreground/80" data-testid="footer-address">
            <MapPin size={18} className="text-primary mt-1 shrink-0" />
            <span>
              {addressLines.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < addressLines.length - 1 && <br />}
                </span>
              ))}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-serif font-bold text-lg text-white">Quick Links</h3>
          <Link href="/our-services" className="text-primary-foreground/80 hover:text-white transition-colors">Our Services</Link>
          <Link href="/life-at-the-glens" className="text-primary-foreground/80 hover:text-white transition-colors">Life at the Glens</Link>
          <Link href="/meet-the-team" className="text-primary-foreground/80 hover:text-white transition-colors">Meet the Team</Link>
          <Link href="/careers" className="text-primary-foreground/80 hover:text-white transition-colors">Careers</Link>
          <Link href="/contact" className="text-primary-foreground/80 hover:text-white transition-colors">Contact & FAQ</Link>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-serif font-bold text-lg text-white">Regulation</h3>
          <p className="text-primary-foreground/80 text-sm mb-2">
            We are fully regulated by the Regulation and Quality Improvement Authority (RQIA) and proud of our "Good" rating.
          </p>
          <a
            href="https://www.rqia.org.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Visit RQIA Website <ExternalLink size={16} />
          </a>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/60 text-sm">
        <p>&copy; {new Date().getFullYear()} Glens Properties LLP. All rights reserved.</p>
        <Link
          href="/staff/login"
          className="flex items-center gap-1.5 hover:text-primary-foreground/80 transition-colors"
          data-testid="nav-staff-login"
        >
          <ShieldCheck size={13} />
          Staff Login
        </Link>
      </div>
    </footer>
  );
}
