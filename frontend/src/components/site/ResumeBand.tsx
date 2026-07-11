import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileUp, CheckCircle2 } from "lucide-react";
import resumeImg from "@/assets/resume-illustration.png";

export function ResumeBand() {
  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 rounded-[36px] border border-border bg-mesh p-8 md:grid-cols-2 md:items-center md:p-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#16B364] shadow-soft">
              No matching job? Still submit.
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
              Don't See a Suitable Job?
              <br />
              <span className="text-gradient-brand">No Problem.</span>
            </h2>
            <p className="mt-4 max-w-lg text-muted-foreground">
              Submit your CV today. We'll add you to our candidate database and
              contact you the moment a suitable opportunity becomes available.
            </p>

            <ul className="mt-6 space-y-2.5">
              {[
                "Freshers and 10th / 12th pass welcome",
                "We keep your CV safe and private",
                "No fees to submit your profile",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16B364]" />
                  {t}
                </li>
              ))}
            </ul>

            <Link
              to="/submit-resume"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-brand px-7 py-4 text-sm font-semibold text-white shadow-float transition-transform hover:-translate-y-0.5"
            >
              <FileUp className="h-4 w-4" />
              Submit Resume
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative mx-auto max-w-md"
          >
            <img
              src={resumeImg}
              alt="Submit your resume"
              width={1024}
              height={912}
              loading="lazy"
              className="w-full"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
