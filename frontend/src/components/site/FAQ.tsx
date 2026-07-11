import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export function FAQ() {
  const { data: faqs = [] } = useQuery<FAQ[]>({
    queryKey: ['faqs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('active', true)
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  if (faqs.length === 0) return null;

  return (
    <section className="bg-white px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#155EEF]">FAQ</p>
          <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl md:text-5xl">
            Questions? We've got answers.
          </h2>
        </div>

        <Accordion type="single" collapsible className="mt-10 space-y-3">
          {faqs.map((f) => (
            <AccordionItem
              key={f.id}
              value={f.id}
              className="overflow-hidden rounded-2xl border border-border bg-white px-5 shadow-soft"
            >
              <AccordionTrigger className="py-5 text-left font-display text-base font-semibold hover:no-underline">
                {f.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-[15px] leading-relaxed text-muted-foreground">
                {f.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
