"use client"

import { motion } from "framer-motion"
import type { LandingPageConfig } from "@/lib/landing-configs"

interface AmenitiesBentoProps {
  config: LandingPageConfig
}

export function AmenitiesBento({ config }: AmenitiesBentoProps) {
  if (!config.amenities || config.amenities.length === 0) return null

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
            <span>III</span>
            <div className="w-12 h-px bg-brass/30" />
            <span className="font-sans font-medium uppercase tracking-widest text-[10px]">Amenities & Facts</span>
          </motion.div>
          <h3 className="font-serif text-3xl md:text-5xl text-parchment">
            The Details
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.amenities.map((amenity, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className={`p-8 rounded-xl border border-white/5 bg-mist hover:border-white/10 transition-colors flex flex-col justify-between ${
                idx === 0 || idx === 3 ? "lg:col-span-2" : "lg:col-span-1"
              }`}
            >
              <h4 className="font-serif text-2xl text-brass mb-4">{amenity.title}</h4>
              <p className="font-sans text-sm text-moss font-light">{amenity.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
