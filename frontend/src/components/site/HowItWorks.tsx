import { motion } from "framer-motion";
import { Send, ScanSearch, Sparkles, PhoneCall, UserCheck } from "lucide-react";

const STEPS = [
  { icon: Send, title: "Send CV", desc: "Submit online in under 2 minutes." },
  { icon: ScanSearch, title: "We Review", desc: "Our team reads every profile." },
  { icon: Sparkles, title: "Suitable Opportunity", desc: "We match you to real openings." },
  { icon: PhoneCall, title: "We Contact You", desc: "A quick call to confirm details." },
  { icon: UserCheck, title: "Interview", desc: "You meet the company directly." },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#155EEF]">How it works</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Simple, transparent, and human
          </h2>
          <p className="mt-4 text-muted-foreground">
            No confusing forms. No fees to apply. Just five easy steps from CV to interview.
          </p>
        </div>

        <div className="relative mt-16">
          {/* connector line */}
          <div className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-3xl border border-border bg-white p-6 text-center shadow-soft transition hover:-translate-y-1 hover:shadow-float"
              >
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="absolute -top-3 right-4 rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-[#155EEF] shadow-soft ring-1 ring-border">
                  0{i + 1}
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
