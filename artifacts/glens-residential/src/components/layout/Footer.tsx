import { Phone, MapPin, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useSettings } from "@/hooks/useSettings";

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
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-serif font-bold text-lg text-white">Contact Us</h3>
          <a
            href={`tel:${phoneDigits}`}
            className="flex items-center gap-3 text-primary-foreground/80 hover:text-white transition-colors"
            data-testid="footer-phone"
          >
            <Phone size={18} className="text-primary shrink-0" />
            <span>{settings.phone}</span>
          </a>
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

      <div className="container mx-auto px-4 mt-12 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60 text-sm">
        <p>&copy; {new Date().getFullYear()} Glens Properties LLP. All rights reserved.</p>
      </div>
    </footer>
  );
}
