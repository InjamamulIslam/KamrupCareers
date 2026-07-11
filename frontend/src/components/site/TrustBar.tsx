import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useSiteSettings } from "@/lib/useSiteSettings";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(end * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, end]);
  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

export function TrustBar() {
  const { data: settings } = useSiteSettings();

  const stats = [
    { value: parseInt(settings?.stat_placements ?? '1200'), suffix: "+", label: "Successful Placements" },
    { value: parseInt(settings?.stat_companies ?? '180'), suffix: "+", label: "Hiring Companies" },
    { value: parseInt(settings?.stat_candidates ?? '8500'), suffix: "+", label: "Registered Candidates" },
    { value: parseInt(settings?.stat_active_jobs ?? '45'), suffix: "+", label: "Active Jobs" },
  ];

  return (
    <section className="relative -mt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-border bg-border shadow-float md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label} className="bg-white px-6 py-8 text-center">
              <div className="font-display text-3xl font-bold text-gradient-brand sm:text-4xl">
                <CountUp end={s.value} suffix={s.suffix} />
              </div>
              <p className="mt-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:text-sm sm:normal-case sm:tracking-normal">
                {s.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
