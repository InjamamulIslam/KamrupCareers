import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileUp, Search } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

export function FinalCta() {
  const { data: settings } = useSiteSettings();
  const headline = settings?.cta_headline ?? 'Still Looking for a Job?';
  const subtext = settings?.cta_subtext ?? "Submit your CV today. We'll contact you when a suitable opportunity matches your profile.";

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-[36px] bg-gradient-brand p-10 text-center text-white shadow-glow sm:p-16"
          style={{ backgroundSize: "200% 200%" }}
        >
          <div className="pointer-events-none absolute inset-0 animate-gradient bg-gradient-brand opacity-90" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

          <div className="relative">
            <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              {headline}
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/90">
              {subtext}
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/submit-resume"
                className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-[#155EEF] shadow-soft transition-transform hover:-translate-y-0.5"
              >
                <FileUp className="h-4 w-4" />
                Submit CV
              </Link>
              <Link
                to="/jobs"
                className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                <Search className="h-4 w-4" />
                Browse Jobs
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
