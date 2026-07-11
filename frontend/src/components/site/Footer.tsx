import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";
import { Logo } from "./Logo";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function Footer() {
  const { data: settings } = useSiteSettings();

  const email = settings?.contact_email ?? 'kamrupcareers@gmail.com';
  const address = settings?.contact_address ?? 'Guwahati, Assam, India';
  const footerDesc = settings?.footer_description ?? 'A local recruitment consultancy in Guwahati, Assam.';
  const fbLink = settings?.social_facebook || '#';
  const igLink = settings?.social_instagram || '#';
  const liLink = settings?.social_linkedin || '#';

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo />
            <p className="mt-4 max-w-sm text-sm text-muted-foreground">
              {footerDesc}
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { Icon: Facebook, href: fbLink },
                { Icon: Instagram, href: igLink },
                { Icon: Linkedin, href: liLink },
              ].map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  target={href !== '#' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground transition hover:border-[#155EEF] hover:text-[#155EEF]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground">Home</Link></li>
              <li><Link to="/jobs" className="hover:text-foreground">Jobs</Link></li>
              <li><Link to="/submit-resume" className="hover:text-foreground">Submit Resume</Link></li>
              <li><Link to="/about" className="hover:text-foreground">About</Link></li>
              <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#155EEF]" />
                <a href={`mailto:${email}`} className="break-all hover:text-foreground">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#16B364]" />
                <span>{address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} {settings?.site_name ?? 'KamrupCareers'}. All rights reserved.</p>
          <p>Made with care in Guwahati.</p>
        </div>
      </div>
    </footer>
  );
}
