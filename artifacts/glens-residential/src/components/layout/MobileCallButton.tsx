import { Phone } from "lucide-react";

export function MobileCallButton() {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-md border-t border-border lg:hidden z-40 pb-safe">
      <a 
        href="tel:02821771396" 
        className="flex items-center justify-center w-full gap-2 bg-primary text-primary-foreground py-3 px-6 rounded-full font-bold shadow-lg hover:bg-primary/90 transition-colors"
        data-testid="mobile-call-button"
      >
        <Phone size={20} />
        <span>Call Us: 028 2177 1396</span>
      </a>
    </div>
  );
}
