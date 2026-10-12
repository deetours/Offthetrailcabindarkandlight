import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { LandingPageConfig } from "@/lib/landing-configs"
import { ArrowUpRight } from "lucide-react"

export interface FaqItemDef {
  question: string
  answer: string
}

interface EstateFaqProps {
  numeral?: string
  headline?: string
  subhead?: string
  items?: FaqItemDef[]
  config?: LandingPageConfig
  conciergeWhatsApp?: string
}

export function EstateFaq({ 
  numeral, 
  headline = "Frequently Asked Questions", 
  subhead,
  items, 
  config,
  conciergeWhatsApp = "919816315898"
}: EstateFaqProps) {
  const faqList: FaqItemDef[] = items || (config?.faq ? config.faq.map(f => ({ question: f.question, answer: f.answer })) : [])
  if (faqList.length === 0) return null

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-card border-t border-border">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center">
          {numeral && (
            <div className="font-serif text-primary text-lg lg:text-xl italic mb-3">
              {numeral}
            </div>
          )}
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">
            {headline}
          </h2>
          {subhead && (
            <p className="text-muted-foreground font-light text-base max-w-xl mx-auto leading-relaxed">
              {subhead}
            </p>
          )}
        </div>
        
        <Accordion type="single" collapsible className="w-full">
          {faqList.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-border">
              <AccordionTrigger className="text-left font-sans font-medium text-base text-foreground hover:text-primary transition-colors py-6 leading-snug">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-sans font-light text-sm text-neutral-300 pb-6 leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {conciergeWhatsApp && (
          <div className="pt-8 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground font-light mb-3">
              Have a specific question about your dates, transport, or special requests?
            </p>
            <a
              href={`https://wa.me/${conciergeWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello! I have a question about staying at Dalhousie Estate.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-sans font-semibold uppercase tracking-widest text-primary hover:text-white transition-colors"
            >
              <span>Ask Concierge on WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        )}
      </div>
    </section>
  )
}

