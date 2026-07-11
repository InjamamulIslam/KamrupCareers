import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, Briefcase, IndianRupee, MapPin, Clock, ArrowUpRight, Loader2 } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FinalCta } from "@/components/site/FinalCta";
import { CATEGORIES } from "@/lib/jobs-data"; // Keep categories static for filter buttons
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Browse Private Jobs in Guwahati — KamrupCareers" },
      { name: "description", content: "Browse current private job openings across Guwahati. Receptionist, HR, Sales, Accountant, Telecaller, and more." },
      { property: "og:title", content: "Browse Jobs — KamrupCareers" },
      { property: "og:description", content: "Genuine private job openings around Guwahati, updated weekly." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const filtered = useMemo(() => {
    if (!jobs) return [];
    return jobs.filter((j) => {
      if (cat !== "All" && j.category !== cat) return false;
      if (q && !`${j.title} ${j.company} ${j.location}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [jobs, q, cat]);

  return (
    <SiteLayout>
      <section className="bg-mesh px-4 pt-32 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            Find Your Next Job
            <br /><span className="text-gradient-brand">in Guwahati</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Browse verified private openings from local companies. Apply directly or submit your CV.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl items-center gap-2 rounded-full border border-border bg-white p-2 shadow-float">
            <Search className="ml-3 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by role, company, or location"
              className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="rounded-full bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white">Search</button>
          </div>

          <div className="mx-auto mt-6 flex flex-wrap justify-center gap-2">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                  cat === c
                    ? "border-transparent bg-gradient-brand text-white shadow-soft"
                    : "border-border bg-white text-foreground/80 hover:border-[#155EEF]/50"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> job{filtered.length !== 1 ? "s" : ""}
          </p>

          {isLoading ? (
            <div className="flex h-48 w-full items-center justify-center rounded-3xl border border-border bg-white">
              <Loader2 className="h-8 w-8 animate-spin text-[#155EEF]" />
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-14 text-center text-destructive">
              <h3 className="font-display text-xl font-semibold">Failed to load jobs</h3>
              <p className="mt-2 text-sm">Please check your internet connection or try again later.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-border bg-white p-14 text-center">
              <h3 className="font-display text-xl font-semibold">No matching jobs right now</h3>
              <p className="mt-2 text-sm text-muted-foreground">Submit your CV — we'll contact you when a role opens up.</p>
              <Link to="/submit-resume" className="mt-6 inline-flex rounded-full bg-gradient-brand px-6 py-3 text-sm font-semibold text-white shadow-float">
                Submit Resume
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((j) => (
                <div 
                  key={j.id} 
                  onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: j.id } })}
                  className="group flex flex-col cursor-pointer rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-gray-300"
                >
                  <div className="flex items-start justify-between">
                    <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB]">
                      {j.category}
                    </span>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F5F9] text-[#2563EB]">
                      <Briefcase className="h-5 w-5" />
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <h3 className="font-display text-xl font-bold leading-tight text-gray-900">{j.title}</h3>
                    <p className="mt-1 text-sm font-medium text-gray-500">{j.company}</p>
                  </div>
                  
                  <div className="mt-6 space-y-3 text-sm font-medium text-gray-600 flex-1">
                    <div className="flex items-center gap-3">
                      <IndianRupee className="h-4 w-4 text-[#10B981]" />
                      <span>{j.salary_range || 'Not disclosed'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{j.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{j.type}</span>
                    </div>
                  </div>
                  
                  <Link 
                    to="/submit-resume"
                    search={{ jobId: j.id }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F172A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E293B]"
                  >
                    Apply Now <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FinalCta />
    </SiteLayout>
  );
}

