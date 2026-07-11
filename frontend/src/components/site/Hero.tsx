import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Building, Briefcase } from "lucide-react";
import { useSiteSettings } from "@/lib/useSiteSettings";

const PINTEREST_CARDS = [
  { role: "Front Office Executive", company: "Apollo Hospitals", location: "Christian Basti" },
  { role: "Sales Manager", company: "Reliance Digital", location: "GS Road" },
  { role: "HR Generalist", company: "Tech Mahindra", location: "Azara" },
  { role: "Accountant", company: "Maruti Suzuki Arena", location: "Six Mile" },
  { role: "Store Manager", company: "Pantaloons", location: "Downtown" },
  { role: "Data Analyst", company: "Zomato Zonal Office", location: "Bhangagarh" },
  { role: "Customer Support", company: "Swiggy Hub", location: "Ulubari" },
  { role: "Marketing Executive", company: "Prag News", location: "Ganeshguri" },
  { role: "Graphic Designer", company: "Local Ad Agency", location: "Zoo Road" },
  { role: "Operations Head", company: "Amazon Logistics", location: "Lokhra" },
  { role: "IT Administrator", company: "Guwahati University", location: "Jalukbari" },
  { role: "Business Dev", company: "Byjus", location: "Silpukhuri" },
];

function MasonryColumn({ direction, delay, cards }: { direction: 'up' | 'down', delay: string, cards: typeof PINTEREST_CARDS }) {
  const animateClass = direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down';
  return (
    <div className="flex-1 overflow-hidden flex flex-col gap-4 relative" style={{ animationDelay: delay }}>
      <div className={`flex flex-col gap-4 w-full ${animateClass}`}>
        {[...cards, ...cards, ...cards].map((card, i) => (
          <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-border/60 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-[#155EEF] flex items-center justify-center shrink-0">
                <Briefcase size={14} />
              </div>
              <h4 className="font-bold text-xs md:text-sm text-foreground line-clamp-1">{card.role}</h4>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground mb-1">
              <Building size={12} className="shrink-0" />
              <span className="line-clamp-1">{card.company}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-muted-foreground">
              <MapPin size={12} className="shrink-0" />
              <span className="line-clamp-1">{card.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Hero() {
  const { data: settings } = useSiteSettings();

  const badge = settings?.hero_badge_text ?? "Guwahati's Premier Recruitment Consultancy";
  const headline = settings?.hero_headline ?? "Connecting Talent with Genuine Opportunities";
  const subtext = settings?.hero_subtext ?? "We connect freshers and experienced professionals with trusted companies in Assam.";
  const btnPrimary = settings?.hero_btn_primary ?? "Submit Your CV";
  const btnSecondary = settings?.hero_btn_secondary ?? "Browse Active Jobs";

  const col1 = PINTEREST_CARDS.slice(0, 3);
  const col2 = PINTEREST_CARDS.slice(3, 6);
  const col3 = PINTEREST_CARDS.slice(6, 9);
  const col4 = PINTEREST_CARDS.slice(9, 12);
  const col5 = [...PINTEREST_CARDS.slice(0, 2), ...PINTEREST_CARDS.slice(6, 7)];

  return (
    <section className="relative w-full pt-28 pb-12 md:pt-36 md:pb-20 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center overflow-hidden bg-[#F1F5F9]">
      {/* Dynamic Pinterest Masonry Background */}
      <div className="absolute inset-0 z-0 flex gap-4 p-4 opacity-100 overflow-hidden select-none pointer-events-none">
        <div className="hidden lg:flex w-full h-[300%] gap-4 -mt-[30%]">
          <MasonryColumn direction="up" delay="0s" cards={col1} />
          <MasonryColumn direction="down" delay="-15s" cards={col2} />
          <MasonryColumn direction="up" delay="-7s" cards={col3} />
          <MasonryColumn direction="down" delay="-22s" cards={col4} />
          <MasonryColumn direction="up" delay="-12s" cards={col5} />
        </div>
        <div className="flex lg:hidden w-full h-[300%] gap-4 -mt-[30%]">
          <MasonryColumn direction="up" delay="0s" cards={[...col1, ...col4]} />
          <MasonryColumn direction="down" delay="-12s" cards={[...col2, ...col5]} />
          <MasonryColumn direction="up" delay="-5s" cards={[...col3, ...col1]} />
        </div>

        {/* Soft edge fading to keep focus in center */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F1F5F9] via-transparent to-[#F1F5F9] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F1F5F9] via-transparent to-[#F1F5F9] pointer-events-none" />

        {/* Subtle Glow behind center card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#155EEF]/20 to-[#16B364]/20 blur-[80px] pointer-events-none" />
      </div>

      {/* Foreground Content */}
      <div className="z-10 w-full max-w-[95%] sm:max-w-[85%] md:max-w-[700px] px-4 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass-card rounded-[2rem] p-6 sm:p-8 md:px-12 py-8 flex flex-col items-center text-center w-full relative overflow-hidden shadow-2xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-border/50 shadow-sm text-xs font-medium mb-4 text-muted-foreground relative z-10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#16B364] animate-pulse" />
            {badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-[3rem] font-bold font-display tracking-tight text-foreground mb-4 leading-[1.15] relative z-10"
          >
            {headline.split(' ').slice(0, -2).join(' ')}{' '}
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#155EEF] to-[#16B364]">
              {headline.split(' ').slice(-2).join(' ')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-sm md:text-base text-muted-foreground mb-6 max-w-[500px] mx-auto leading-relaxed relative z-10"
          >
            {subtext}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full max-w-sm flex flex-col sm:flex-row gap-3 justify-center relative z-10"
          >
            <Link
              to="/submit-resume"
              className="group inline-flex items-center justify-center gap-2 rounded-full h-12 px-6 text-sm font-medium text-white shadow-lg shadow-[#155EEF]/20 bg-[#155EEF] hover:bg-[#155EEF]/90 transition-all w-full sm:w-auto"
            >
              {btnPrimary}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center justify-center gap-2 rounded-full h-12 px-6 text-sm font-medium bg-white/80 border border-white/60 shadow-sm hover:bg-white transition-all text-foreground backdrop-blur-md w-full sm:w-auto"
            >
              {btnSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
