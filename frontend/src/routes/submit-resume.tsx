import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { CheckCircle2, FileUp, ShieldCheck, HeartHandshake, Zap } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { CATEGORIES } from "@/lib/jobs-data";
import { supabase } from "@/lib/supabase";
import resumeImg from "@/assets/resume-illustration.png";

type JobSearch = {
  jobId?: string;
};

export const Route = createFileRoute("/submit-resume")({
  validateSearch: (search: Record<string, unknown>): JobSearch => {
    return {
      jobId: search.jobId as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Submit Your Resume — KamrupCareers" },
      { name: "description", content: "Submit your CV to KamrupCareers. We'll contact you when a suitable private job opens up in Guwahati." },
      { property: "og:title", content: "Submit Your Resume — KamrupCareers" },
      { property: "og:description", content: "Freshers and experienced candidates welcome. Takes under 2 minutes." },
    ],
  }),
  component: SubmitResumePage,
});

const schema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  email: z.string().email("Please enter a valid email"),
  qualification: z.string().min(1, "Please select your qualification"),
  experience: z.string().min(1, "Please select your experience"),
  category: z.string().min(1, "Please choose a category"),
  location: z.string().min(2, "Please enter your location"),
  message: z.string().optional(),
});
type FormValues = z.infer<typeof schema>;

const QUALIFICATIONS = ["10th Pass", "12th Pass", "Graduate", "Post-Graduate", "Other"];
const EXPERIENCE = ["Fresher", "0–1 years", "1–3 years", "3–5 years", "5+ years"];

function SubmitResumePage() {
  const { jobId } = Route.useSearch();
  const [submitted, setSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!cvFile) {
        toast.error("Please upload your CV before submitting.");
        return;
      }

      // 1. Upload CV to Storage
      const fileExt = cvFile.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('resumes')
        .upload(filePath, cvFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw new Error("Failed to upload CV. Please ensure you are uploading a valid file.");
      }

      // 2. Insert into Applications table
      const { error: insertError } = await supabase.from('applications').insert([
        {
          job_id: jobId || null,
          name: data.name,
          phone: data.phone,
          email: data.email,
          qualification: data.qualification,
          experience: data.experience,
          location: data.location,
          category: data.category,
          message: data.message || '',
          cv_url: uploadData?.path || filePath
        }
      ]);

      if (insertError) {
        throw new Error("Failed to save application. Please try again later.");
      }

      toast.success("CV submitted! We'll contact you when a suitable opportunity opens up.");
      setSubmitted(true);
      reset();
      setCvFile(null);
      setTimeout(() => setSubmitted(false), 6000);
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "An unexpected error occurred.");
    }
  };

  return (
    <SiteLayout>
      <section className="bg-mesh px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-2 md:items-center">
          <div>
            <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#16B364] shadow-soft">
              Free · Under 2 minutes
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
              Submit Your CV
              <br /><span className="text-gradient-brand">We'll Take It From Here</span>
            </h1>
            <p className="mt-4 max-w-lg text-muted-foreground">
              You don't need to be perfect. You just need to submit your CV. We'll match you to real openings around Guwahati.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                { icon: HeartHandshake, t: "Freshers, 10th & 12th pass welcome" },
                { icon: ShieldCheck, t: "Your data stays private and safe" },
                { icon: Zap, t: "Fast response when a match is found" },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3 text-sm text-foreground/85">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-white shadow-soft text-[#155EEF]"><Icon className="h-4 w-4" /></div>
                  {t}
                </li>
              ))}
            </ul>

            <img src={resumeImg} alt="" width={1024} height={912} loading="lazy" className="mt-8 hidden max-w-sm md:block" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[28px] border border-border bg-white p-6 shadow-float sm:p-8"
          >
            {submitted ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-[#16B364]/10 text-[#16B364]">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">Thank you!</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Your CV has been received. Our team will reach out when a suitable opportunity matches your profile.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                <h2 className="font-display text-2xl font-bold">Your details</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Full name" error={errors.name?.message}>
                    <input {...register("name")} className={input} placeholder="e.g. Ankita Baruah" />
                  </Field>
                  <Field label="Phone number" error={errors.phone?.message}>
                    <input {...register("phone")} className={input} placeholder="10-digit mobile" />
                  </Field>
                </div>
                <Field label="Email" error={errors.email?.message}>
                  <input {...register("email")} type="email" className={input} placeholder="you@example.com" />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Qualification" error={errors.qualification?.message}>
                    <select {...register("qualification")} className={input} defaultValue="">
                      <option value="" disabled>Select…</option>
                      {QUALIFICATIONS.map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </Field>
                  <Field label="Experience" error={errors.experience?.message}>
                    <select {...register("experience")} className={input} defaultValue="">
                      <option value="" disabled>Select…</option>
                      {EXPERIENCE.map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Preferred category" error={errors.category?.message}>
                    <select {...register("category")} className={input} defaultValue="">
                      <option value="" disabled>Select…</option>
                      {CATEGORIES.map((q) => <option key={q}>{q}</option>)}
                    </select>
                  </Field>
                  <Field label="Location" error={errors.location?.message}>
                    <input {...register("location")} className={input} placeholder="e.g. Beltola, Guwahati" />
                  </Field>
                </div>
                <Field label="Short message (optional)">
                  <textarea {...register("message")} rows={3} className={input} placeholder="Tell us anything else about you" />
                </Field>
                <Field label="Upload CV (PDF or Word)">
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 px-4 py-4 text-sm text-muted-foreground transition hover:border-[#155EEF] hover:text-[#155EEF]">
                    <FileUp className="h-5 w-5" />
                    <span>{cvFile ? cvFile.name : "Click to upload your CV"}</span>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setCvFile(file);
                      }} 
                    />
                  </label>
                </Field>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-brand px-7 py-4 text-sm font-semibold text-white shadow-float transition-transform hover:-translate-y-0.5 disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting…" : "Submit My CV"}
                </button>
                <p className="text-center text-xs text-muted-foreground">
                  By submitting, you agree to be contacted by KamrupCareers about job opportunities.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </SiteLayout>
  );
}

const input =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#155EEF] focus:ring-4 focus:ring-[#155EEF]/10";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-foreground/80">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
