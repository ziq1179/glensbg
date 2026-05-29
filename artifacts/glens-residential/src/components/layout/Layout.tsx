import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileCallButton } from "./MobileCallButton";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative pb-[76px] lg:pb-0">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <MobileCallButton />
    </div>
  );
}
