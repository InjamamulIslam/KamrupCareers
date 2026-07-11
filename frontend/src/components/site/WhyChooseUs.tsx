import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  MousePointerClick,
  Zap,
  ShieldCheck,
  HeartHandshake,
} from "lucide-react";

const REASONS = [
  { icon: BadgeCheck, title: "Genuine Job Openings", desc: "Every posting is verified with the hiring company." },
  { icon: Building2, title: "Local Companies", desc: "Roles within Guwahati and the wider Kamrup region." },
  { icon: MousePointerClick, title: "Easy Application", desc: "Submit your CV in 2 minutes, no complicated forms." },
  { icon: Zap, title: "Fast Response", desc: "We reach out quickly when your profile matches." },
  { icon: ShieldCheck, title: "Trusted Consultancy", desc: "A local team you can meet in person any time." },
  { icon: HeartHandshake, title: "Friendly Support", desc: "Freshers, 10th & 12th pass — everyone welcome." },
];

export function WhyChooseUs() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#155EEF]">Why choose us</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Built for job seekers in Guwahati
          </h2>
          <p className="mt-4 text-muted-foreground">
            You don't need to be perfect. You just need to submit your CV.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-3xl border border-border bg-white p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-float"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand-soft text-[#155EEF] transition group-hover:bg-gradient-brand group-hover:text-white">
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
