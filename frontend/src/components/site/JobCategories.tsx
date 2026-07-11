import { motion } from "framer-motion";
import {
  Headset,
  Building,
  TrendingUp,
  Users,
  Calculator,
  Phone,
  Monitor,
  UtensilsCrossed,
  ShoppingBag,
  Cpu,
  Megaphone,
} from "lucide-react";

const CATS = [
  { icon: Headset, label: "Receptionist" },
  { icon: Building, label: "Office Jobs" },
  { icon: TrendingUp, label: "Sales" },
  { icon: Users, label: "HR" },
  { icon: Calculator, label: "Accountant" },
  { icon: Phone, label: "Telecaller" },
  { icon: Monitor, label: "Computer Operator" },
  { icon: UtensilsCrossed, label: "Hospitality" },
  { icon: ShoppingBag, label: "Retail" },
  { icon: Cpu, label: "IT" },
  { icon: Megaphone, label: "Marketing" },
];

export function JobCategories() {
  return (
    <section className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#16B364]">Categories</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Explore by job type
          </h2>
          <p className="mt-4 text-muted-foreground">
            Choose a category that matches your interests — we hire across every one of these.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {CATS.map((c, i) => (
            <motion.button
              key={c.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-white p-5 text-center shadow-soft transition hover:-translate-y-1 hover:border-[#155EEF]/40 hover:shadow-float"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand-soft text-[#155EEF] transition group-hover:bg-gradient-brand group-hover:text-white">
                <c.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{c.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
