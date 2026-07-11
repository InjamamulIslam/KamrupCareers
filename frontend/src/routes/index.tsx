import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/site/Hero";
import { TrustBar } from "@/components/site/TrustBar";
import { HowItWorks } from "@/components/site/HowItWorks";
import { LatestJobs } from "@/components/site/LatestJobs";
import { WhyChooseUs } from "@/components/site/WhyChooseUs";
import { ResumeBand } from "@/components/site/ResumeBand";
import { JobCategories } from "@/components/site/JobCategories";
import { CareerTips } from "@/components/site/CareerTips";
import { Testimonials } from "@/components/site/Testimonials";
import { FAQ } from "@/components/site/FAQ";
import { FinalCta } from "@/components/site/FinalCta";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <TrustBar />
      <HowItWorks />
      <LatestJobs limit={6} />
      <WhyChooseUs />
      <ResumeBand />
      <JobCategories />
      <CareerTips />
      <Testimonials />
      <FAQ />
      <FinalCta />
    </SiteLayout>
  );
}
