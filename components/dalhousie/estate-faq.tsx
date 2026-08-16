import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export function EstateFaq() {
  return (
    <section className="bg-ink text-parchment py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-3xl mx-auto space-y-12">
        <h3 className="font-serif text-3xl md:text-5xl text-parchment text-center">
          The Details
        </h3>
        
        <Accordion type="single" collapsible className="w-full font-sans text-moss">
          <AccordionItem value="item-1" className="border-white/10">
            <AccordionTrigger className="text-left font-semibold uppercase tracking-widest text-xs hover:text-parchment transition-colors py-6">
              Check-in & Check-out
            </AccordionTrigger>
            <AccordionContent className="font-light text-sm pb-6 leading-relaxed">
              Check-in is at 2:00 PM, and check-out is at 11:00 AM. If you need a late check-out, please let us know during booking and we will accommodate if the estate is free.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border-white/10">
            <AccordionTrigger className="text-left font-semibold uppercase tracking-widest text-xs hover:text-parchment transition-colors py-6">
              Food & Dining
            </AccordionTrigger>
            <AccordionContent className="font-light text-sm pb-6 leading-relaxed">
              Breakfast is included with all rooms. We have an in-house kitchen that prepares fresh, local Himachali meals and standard continental fare for lunch and dinner upon request.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="border-white/10">
            <AccordionTrigger className="text-left font-semibold uppercase tracking-widest text-xs hover:text-parchment transition-colors py-6">
              Pet Policy
            </AccordionTrigger>
            <AccordionContent className="font-light text-sm pb-6 leading-relaxed">
              We welcome well-behaved pets. Please inform us in advance so we can prepare accordingly. A small cleaning fee may apply.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="border-white/10">
            <AccordionTrigger className="text-left font-semibold uppercase tracking-widest text-xs hover:text-parchment transition-colors py-6">
              Cancellation Policy
            </AccordionTrigger>
            <AccordionContent className="font-light text-sm pb-6 leading-relaxed">
              Full refund if cancelled 7 days prior to check-in. 50% refund if cancelled within 7 days. No-shows will be charged the full amount.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </section>
  )
}
