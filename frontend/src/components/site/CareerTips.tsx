import { motion } from "framer-motion";
import { FileText, MessageCircle, Mic, Briefcase, ArrowRight } from "lucide-react";

const TIPS = [
  {
    icon: FileText,
    tag: "Resume",
    title: "Write a Simple, Honest Resume",
    desc: "Keep it to one page. Mention your skills, education, and any small work experience clearly.",
  },
  {
    icon: MessageCircle,
    tag: "Interview",
    title: "Face the Interview with Confidence",
    desc: "Reach 10 minutes early. Speak clearly. It's okay if your English isn't perfect.",
  },
  {
    icon: Mic,
    tag: "Communication",
    title: "Improve Your Communication",
    desc: "Practice short conversations daily. Confidence matters more than perfect grammar.",
  },
  {
    icon: Briefcase,
    tag: "Workplace",
    title: "Workplace Etiquette Basics",
    desc: "Punctuality, respect, and a friendly attitude open more doors than skills alone.",
  },
];

export function CareerTips() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#155EEF]">Career tips</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Practical advice for your journey
            </h2>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {TIPS.map((t, i) => (
            <motion.article
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group flex flex-col rounded-3xl border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-float"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-brand-soft text-[#155EEF]">
                <t.icon className="h-5 w-5" />
              </div>
              <span className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-[#16B364]">
                {t.tag}
              </span>
              <h3 className="mt-1.5 font-display text-lg font-semibold leading-snug">{t.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.desc}</p>
              <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#155EEF]">
                Read more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
