"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

const transition = {
  duration: 1,
  ease: [0.23, 1, 0.32, 1] as any,
}

const faqs = [
  {
    question: "What level of curation can I expect from an OffTheTrail experience?",
    answer:
      "Every stay is meticulously designed for those who appreciate quiet luxury. From architectural integration with the landscape to bespoke in-room amenities, our properties are curated for absolute comfort, absolute privacy, and absolute immersion.",
  },
  {
    question: "Do you accommodate specific dietary requirements or private dining?",
    answer:
      "Yes. Our culinary teams excel in crafting hyper-local, seasonal menus tailored to your exact preferences. Whether you require plant-based curation, allergen-specific preparation, or desire a private dining setup overlooking the valley, our concierge will arrange it prior to your arrival.",
  },
  {
    question: "How is privacy maintained at OffTheTrail properties?",
    answer:
      "Privacy is our ultimate luxury. Our stays are geographically isolated and structurally designed to ensure you never have to see another guest unless you choose to. With limited room counts and expansive private domains, seclusion is guaranteed.",
  },
  {
    question: "Are your spaces equipped for remote work or extended sabbaticals?",
    answer:
      "Absolutely. While we encourage disconnection, we understand the modern need for connectivity. Our properties feature enterprise-grade internet and dedicated, architecturally inspiring workspaces, making them perfect for executive retreats or deep work blocks.",
  },
  {
    question: "Can your concierge arrange bespoke local experiences?",
    answer:
      "Yes. We bypass standard tourism to offer you access to hidden elements of the region. From private guided hikes with local naturalists to exclusive cultural immersions and private wellness sessions, everything is orchestrated discreetly for you.",
  },
  {
    question: "What is your policy on direct reservations and cancellations?",
    answer:
      "We highly recommend reserving directly through our concierge to ensure the most personalized experience. Direct reservations guarantee priority room allocation, flexible cancellation terms, and immediate access to our pre-arrival planning team.",
  },
]

export function SceneFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-6 py-32 md:px-16 lg:px-24 bg-card/20 relative overflow-hidden">
      <div className="mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={transition}
          className="mb-20"
        >
          <h2 className="font-serif text-5xl md:text-7xl text-foreground mb-6 tracking-tight">Questions, answered.</h2>
          <p className="font-sans text-xl text-muted-foreground/80 lowercase italic">
            Everything you need to know before you book.
          </p>
        </motion.div>

        {/* FAQs */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...transition, delay: index * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-2xl glass inner-glow hover:bg-white/5 transition-colors duration-500 group"
              >
                <div className="flex items-center justify-between gap-6">
                  <h3 className="font-sans text-lg md:text-xl text-foreground font-medium group-hover:text-primary transition-colors duration-500">
                    {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={transition}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                </div>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0, marginTop: 0 }}
                      animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                      exit={{ height: 0, opacity: 0, marginTop: 0 }}
                      transition={transition}
                      className="overflow-hidden"
                    >
                      <p className="font-sans text-base md:text-lg text-muted-foreground/80 leading-relaxed border-t border-white/5 pt-6">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ ...transition, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="font-sans text-muted-foreground/60 mb-8 lowercase italic">Still have questions?</p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex px-10 py-4 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-sans text-sm font-semibold tracking-widest uppercase"
          >
            Message us on WhatsApp
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
