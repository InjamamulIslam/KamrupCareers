import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { FinalCta } from "@/components/site/FinalCta";
import { Testimonials } from "@/components/site/Testimonials";
import { CheckCircle2, MapPin, Users, Building2, Heart } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About KamrupCareers — Local Recruitment in Guwahati" },
      { name: "description", content: "KamrupCareers is a local recruitment consultancy based in Guwahati, Assam. Learn about our mission, values, and team." },
      { property: "og:title", content: "About KamrupCareers" },
      { property: "og:description", content: "A friendly, trusted local recruitment consultancy in Guwahati." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      <section className="bg-mesh px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#155EEF] shadow-soft">
            About us
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
            A local team helping people find
            <br /><span className="text-gradient-brand">real jobs in Guwahati</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted-foreground">
            KamrupCareers is a friendly recruitment consultancy based right here in Guwahati.
            We work with local companies to fill genuine private job openings — from receptionists
            and telecallers to accountants and HR executives.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          {[
            { icon: MapPin, title: "Locally Rooted", desc: "Based in Guwahati. We understand the local job market and local companies." },
            { icon: Heart, title: "Human First", desc: "We treat every candidate with respect — freshers, 10th pass, everyone." },
            { icon: Building2, title: "Verified Openings", desc: "Every job we publish is confirmed with the hiring company first." },
          ].map((v) => (
            <div key={v.title} className="rounded-3xl border border-border bg-white p-7 shadow-soft">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#16B364]">Our story</p>
            <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl">Built for the people of Kamrup</h2>
            <p className="mt-4 text-muted-foreground">
              We started KamrupCareers because we noticed the same problem again and again:
              honest, hard-working people around Guwahati were struggling to find genuine
              job opportunities. Big job portals felt impersonal and full of fake postings.
            </p>
            <p className="mt-3 text-muted-foreground">
              So we built a simple, local alternative. You submit your CV once, and we
              personally reach out when a real opening matches your profile.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { n: "1,200+", l: "Placements" },
              { n: "180+", l: "Local Companies" },
              { n: "8,500+", l: "Candidates" },
              { n: "5★", l: "Avg. Rating" },
            ].map((s) => (
              <div key={s.l} className="rounded-3xl border border-border bg-mesh p-6 text-center">
                <div className="font-display text-3xl font-bold text-gradient-brand">{s.n}</div>
                <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-border bg-white p-8 shadow-soft sm:p-12">
          <div className="flex items-center gap-3">
            <Users className="h-6 w-6 text-[#155EEF]" />
            <h2 className="font-display text-2xl font-bold sm:text-3xl">Our promise to you</h2>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {[
              "Every job posting is real and verified",
              "We never share your CV without permission",
              "We respond in simple, friendly language",
              "No fees to submit your CV",
              "Freshers get the same attention as experienced candidates",
              "We're always reachable — email, phone, or in person",
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/85">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#16B364]" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Testimonials />
      <FinalCta />
    </SiteLayout>
  );
}
