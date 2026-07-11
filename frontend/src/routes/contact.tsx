import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Mail, MapPin, Phone, Send, Clock } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { supabase } from "@/lib/supabase";
import { useSiteSettings } from "@/lib/useSiteSettings";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact KamrupCareers — Get in Touch" },
      { name: "description", content: "Reach the KamrupCareers team. Email kamrupcareers@gmail.com or visit us in Guwahati, Assam." },
      { property: "og:title", content: "Contact KamrupCareers" },
      { property: "og:description", content: "We'd love to hear from you. Email, call, or send us a message." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { data: settings } = useSiteSettings();

  const email = settings?.contact_email ?? 'kamrupcareers@gmail.com';
  const phone = settings?.contact_phone ?? '+91 98XXX XXXXX';
  const address = settings?.contact_address ?? 'Guwahati, Assam';
  const officeHours = settings?.office_hours ?? 'Monday – Saturday: 10:00 AM – 6:00 PM';

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const name = (form.elements.namedItem('name') as HTMLInputElement)?.value;
    const emailVal = (form.elements.namedItem('email') as HTMLInputElement)?.value;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement)?.value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)?.value;

    const { error } = await supabase.from('contact_messages').insert([{ name, email: emailVal, subject, message }]);
    setLoading(false);

    if (error) {
      toast.error('Failed to send message. Please try again.');
    } else {
      toast.success("Message sent! We'll reply within one working day.");
      form.reset();
    }
  };

  return (
    <SiteLayout>
      <section className="bg-mesh px-4 pt-32 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#155EEF] shadow-soft">Contact</span>
          <h1 className="mt-4 font-display text-4xl font-bold sm:text-5xl md:text-6xl">
            We'd love to <span className="text-gradient-brand">hear from you</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Questions about a job? Want to hire through us? Send us a message and we'll reply quickly.
          </p>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          {[
            { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
            { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, '')}` },
            { icon: MapPin, label: "Office", value: address },
          ].map((c) => (
            <a
              key={c.label}
              href={c.href ?? "#"}
              className="group rounded-3xl border border-border bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-float"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-brand text-white shadow-glow">
                <c.icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.label}</p>
              <p className="mt-1 font-display text-lg font-semibold text-foreground">{c.value}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-white p-8 shadow-soft">
            <h2 className="font-display text-2xl font-bold">Send a message</h2>
            <form onSubmit={onSubmit} className="mt-6 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input name="name" required placeholder="Your name" className={input} />
                <input name="email" required type="email" placeholder="Your email" className={input} />
              </div>
              <input name="subject" placeholder="Subject" className={input} />
              <textarea name="message" required rows={5} placeholder="How can we help?" className={input} />
              <button
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-7 py-4 text-sm font-semibold text-white shadow-float transition-transform hover:-translate-y-0.5 disabled:opacity-70"
              >
                <Send className="h-4 w-4" />
                {loading ? "Sending…" : "Send Message"}
              </button>
            </form>
          </div>

          <div className="rounded-3xl border border-border bg-mesh p-8 shadow-soft">
            <h3 className="font-display text-xl font-bold">Office hours</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-foreground/85">
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#155EEF]" /> {officeHours}</li>
              <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-[#155EEF]" /> Sunday: Closed</li>
            </ul>
            <div className="mt-6 overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Guwahati map"
                src="https://www.google.com/maps?q=Guwahati,Assam&output=embed"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

const input =
  "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none transition focus:border-[#155EEF] focus:ring-4 focus:ring-[#155EEF]/10";
