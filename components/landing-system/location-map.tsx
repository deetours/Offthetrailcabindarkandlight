"use client"

import { motion } from "framer-motion"
import type { LandingPageConfig } from "@/lib/landing-configs"

interface LocationMapProps {
  config: LandingPageConfig
}

export function LocationMap({ config }: LocationMapProps) {
  if (!config.mapUrl) return null

  return (
    <section className="bg-ink text-parchment py-24 px-6 md:px-12 lg:px-24 border-t border-mist relative z-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-sm text-brass italic mb-4 flex items-center gap-4"
          >
            <span>IV</span>
            <div className="w-12 h-px bg-brass/30" />
            <span className="font-sans font-medium uppercase tracking-widest text-[10px]">Location</span>
          </motion.div>
          <h3 className="font-serif text-3xl md:text-5xl text-parchment">
            Getting Here
          </h3>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1 }}
          className="w-full aspect-[4/3] md:aspect-[21/9] rounded-xl overflow-hidden border border-white/5 relative bg-mist"
        >
          <iframe 
            src={config.mapUrl} 
            width="100%" 
            height="100%" 
            style={{ border: 0, filter: "grayscale(100%) invert(90%) contrast(80%) hue-rotate(180deg)" }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map location of ${config.name}`}
            className="absolute inset-0 w-full h-full"
          />
        </motion.div>
      </div>
    </section>
  )
}
