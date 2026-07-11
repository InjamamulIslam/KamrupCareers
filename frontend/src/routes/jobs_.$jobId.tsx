import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FinalCta } from "@/components/site/FinalCta";
import { Briefcase, IndianRupee, MapPin, Clock, ArrowLeft, ArrowUpRight, Loader2, Building2 } from "lucide-react";

export const Route = createFileRoute("/jobs_/$jobId")({
  component: JobDetailsPage,
});

function JobDetailsPage() {
  const { jobId } = Route.useParams();

  const { data: job, isLoading, error } = useQuery({
    queryKey: ['jobs', jobId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single();
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <SiteLayout>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#2563EB]" />
        </div>
      </SiteLayout>
    );
  }

  if (error || !job) {
    return (
      <SiteLayout>
        <div className="flex min-h-[70vh] items-center justify-center flex-col gap-4">
          <h2 className="text-2xl font-bold">Job not found</h2>
          <Link to="/jobs" className="text-[#2563EB] hover:underline flex items-center gap-2">
            <ArrowLeft size={16} /> Back to jobs
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      {/* Header Section */}
      <section className="bg-mesh px-4 pt-32 pb-16 sm:px-6 lg:px-8 border-b border-border">
        <div className="mx-auto max-w-5xl">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition">
            <ArrowLeft size={16} /> Back to all jobs
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex rounded-full bg-[#EFF6FF] px-3 py-1 text-xs font-semibold text-[#2563EB] mb-4">
                {job.category}
              </span>
              <h1 className="font-display text-4xl font-bold sm:text-5xl leading-tight text-gray-900">
                {job.title}
              </h1>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600">
                <span className="flex items-center gap-1.5"><Building2 size={18} className="text-gray-400" /> {job.company}</span>
                <span className="flex items-center gap-1.5"><MapPin size={18} className="text-gray-400" /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={18} className="text-gray-400" /> {job.type}</span>
              </div>
            </div>
            
            <Link 
              to="/submit-resume"
              search={{ jobId: job.id }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0F172A] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-1 hover:bg-[#1E293B] hover:shadow-xl shrink-0"
            >
              Apply for this Job <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid md:grid-cols-[1fr_300px] gap-12">
          
          {/* Main Content */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Job Description</h2>
            <div className="prose prose-gray max-w-none text-gray-600 whitespace-pre-wrap">
              {job.description || "No description provided."}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="rounded-[24px] border border-gray-100 bg-white p-6 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-6 text-gray-900">Job Summary</h3>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Salary Range</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <IndianRupee className="h-5 w-5 text-[#10B981]" />
                    {job.salary_range || 'Not disclosed'}
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Job Type</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <Clock className="h-5 w-5 text-gray-400" />
                    {job.type}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <div className="flex items-center gap-2 text-gray-900 font-medium">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    {job.location}
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-100">
                  <Link 
                    to="/submit-resume"
                    search={{ jobId: job.id }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#1D4ED8]"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <FinalCta />
    </SiteLayout>
  );
}
