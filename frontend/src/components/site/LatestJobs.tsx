import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MapPin, IndianRupee, Briefcase, ArrowUpRight, Clock, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function LatestJobs({ limit = 6 }: { limit?: number }) {
  const navigate = useNavigate();

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['latest_jobs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data || [];
    }
  });

  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16B364]">Latest jobs</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
              Real openings, updated weekly
            </h2>
            <p className="mt-3 text-muted-foreground">
              A snapshot of what companies around Guwahati are hiring for right now.
            </p>
          </div>
          <Link
            to="/jobs"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-[#155EEF] hover:text-[#155EEF]"
          >
            View all jobs <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="mt-10 flex h-48 w-full items-center justify-center rounded-3xl border border-border bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-[#155EEF]" />
          </div>
        ) : error ? (
          <div className="mt-10 rounded-3xl border border-destructive/20 bg-destructive/10 p-14 text-center text-destructive">
            <p>Failed to load jobs.</p>
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((j, i) => (
              <motion.div
                key={j.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => navigate({ to: '/jobs/$jobId', params: { jobId: j.id } })}
                className="group cursor-pointer flex flex-col rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-[#155EEF]/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="inline-block rounded-full bg-[#155EEF]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#155EEF]">
                      {j.category}
                    </span>
                    <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-gray-900">{j.title}</h3>
                    <p className="mt-1 truncate text-sm font-medium text-gray-500">{j.company}</p>
                  </div>
                  <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#F1F5F9] text-[#2563EB]">
                    <Briefcase className="h-5 w-5" />
                  </div>
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
                    <span>{j.type} · {timeAgo(j.created_at)}</span>
                  </div>
                </div>

                <Link
                  to="/submit-resume"
                  search={{ jobId: j.id }}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-[#0F172A] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1E293B]"
                >
                  Apply Now <ArrowUpRight className="h-4 w-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-border bg-white p-14 text-center">
             <h3 className="font-display text-xl font-semibold">No active jobs right now</h3>
             <p className="mt-2 text-sm text-muted-foreground">Check back later or view all jobs.</p>
          </div>
        )}
      </div>
    </section>
  );
}

