import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { MobileStickyCta } from "./MobileStickyCta";
import { AnnouncementBanner } from "./AnnouncementBanner";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <AnnouncementBanner />
      <Navbar />
      <main className="pb-24 md:pb-0">{children}</main>
      <Footer />
      <MobileStickyCta />
    </div>
  );
}

