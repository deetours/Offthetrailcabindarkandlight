"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import type { LandingPageConfig } from "@/lib/landing-configs"

interface StorySceneProps {
  config: LandingPageConfig
}

export function StoryScene({ config }: StorySceneProps) {
  return (
    <section className="relative bg-ink text-parchment w-full">
      <div className="flex flex-col lg:grid lg:grid-cols-12 min-h-screen">
        
        {/* Left Column: Pinned Image */}
        <div className="lg:col-span-7 relative h-[60vh] lg:h-screen lg:sticky lg:top-0 order-1 lg:order-1 border-r border-mist z-0">
          <Image
            src={config.storyImage || config.heroImage}
            alt="The Estate"
            fill
            className="object-cover"
          />
          {/* Subtle gradient to blend edge if needed */}
          <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-ink to-transparent opacity-0 lg:opacity-30 pointer-events-none" />

          {/* Anti-Grid Overlapping Image Tile (Desktop only collage) */}
          <motion.div
            initial={{ opacity: 0, y: 50, rotate: 5 }}
            whileInView={{ opacity: 1, y: 0, rotate: -2 }}
            viewport={{ once: true, margin: "-20%" }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block absolute -right-16 bottom-24 w-64 h-80 z-20 border-[4px] border-ink shadow-2xl overflow-hidden pointer-events-none"
          >
             <Image
              src={config.heroImage}
              alt="Detail"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>

        {/* Right Column: Scrolling Narrative */}
        <div className="lg:col-span-5 px-6 md:px-16 py-24 lg:py-32 flex flex-col justify-center order-2 lg:order-2 bg-ink z-10 relative">
          
          <div className="max-w-xl">
            {/* Sequential Marker */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              className="font-serif text-sm text-brass italic mb-8 flex items-center gap-4"
            >
              <span>II</span>
              <div className="w-12 h-px bg-brass/30" />
              <span className="font-sans font-medium uppercase tracking-widest text-[10px]">The Estate</span>
            </motion.div>
            
            {/* Anti-Grid Floating Pull Quote */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 1 }}
              className="hidden lg:block absolute -left-48 top-1/3 z-30 w-80 p-6 bg-ink/90 backdrop-blur-sm border border-white/5 pointer-events-none"
            >
              <p className="font-serif text-xl italic text-brass leading-snug">
                &quot;Trade the noise of the city for the silence of the pines.&quot;
              </p>
            </motion.div>
            
            <h2 className="font-serif text-3xl md:text-5xl text-parchment mb-16 leading-tight">
              A place built for the quiet.
            </h2>
            
            <div className="font-sans text-lg md:text-xl text-moss font-light space-y-12 relative z-10">
              {config.narrative.map((paragraph, idx) => (
                <motion.p 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-20%" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="leading-relaxed"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
