import { Link, useLocation } from "wouter";
import { Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/our-services", label: "Our Services" },
    { href: "/life-at-the-glens", label: "Life at the Glens" },
    { href: "/meet-the-team", label: "Meet the Team" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact & FAQ" },
  ];

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
          <a href="tel:02821771396" className="text-primary hover:text-primary/80 font-medium flex items-center gap-2" data-testid="nav-phone">
            <Phone size={18} />
            <span>028 2177 1396</span>
          </a>
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
                <a href="tel:02821771396" className="text-primary font-medium flex items-center gap-2">
                  <Phone size={18} />
                  <span>028 2177 1396</span>
                </a>
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
