import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { LandingPageConfig } from "@/lib/landing-configs"

interface EstateFaqProps {
  config: LandingPageConfig
}

export function EstateFaq({ config }: EstateFaqProps) {
  if (!config.faq || config.faq.length === 0) return null

  return (
    <section className="bg-ink text-parchment py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <h3 className="font-serif text-3xl md:text-5xl text-parchment text-center">
          The Details
        </h3>
        
        <Accordion type="single" collapsible className="w-full font-sans text-moss">
          {config.faq.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-white/10">
              <AccordionTrigger className="text-left font-semibold uppercase tracking-widest text-xs hover:text-parchment transition-colors py-6">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-light text-sm pb-6 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
