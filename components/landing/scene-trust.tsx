"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const trustPoints = [
  {
    num: "01",
    title: "Places That Feel Discovered",
    description: "Not just remote, but removed in the way that matters, quieter, slower, and held by landscape.",
  },
  {
    num: "02",
    title: "Silence, Carefully Kept",
    description: "Spaces made for unhurried mornings, long exhale evenings, and the kind of stillness that stays with you.",
  },
  {
    num: "03",
    title: "A More Personal Arrival",
    description: "Before you arrive, you already know the people waiting on the other side, direct, human, and close.",
  },
]

export function SceneTrust() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const headerOpacity = useTransform(scrollYProgress, [0.05, 0.2], [0, 1])
  const headerY = useTransform(scrollYProgress, [0.05, 0.2], [30, 0])

  return (
    <section ref={sectionRef} className="relative px-6 py-40 md:px-16 lg:px-24 bg-background">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-24 text-center">
          <span className="text-[10px] uppercase tracking-editorial-label text-primary/50 font-bold block mb-6">
            A Quiet Standard
          </span>
          <h2 className="font-serif text-4xl md:text-6xl text-foreground tracking-tightest leading-tight">
            The <span className="italic">Off the Trail</span> Promise
          </h2>
        </motion.div>

        {/* Trust Points — 3 column minimalist grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {trustPoints.map((point, i) => {
            const startIn = 0.1 + i * 0.1
            const endIn = startIn + 0.15
            const ptOpacity = useTransform(scrollYProgress, [startIn, endIn, 0.85, 0.98], [0, 1, 1, 0])
            const ptY = useTransform(scrollYProgress, [startIn, endIn], [30, 0])

            return (
              <motion.div
                key={i}
                style={{ opacity: ptOpacity, y: ptY }}
                className="group flex flex-col items-center text-center p-8 border border-white/5 bg-white/[0.02] rounded-2xl hover:bg-white/[0.04] transition-colors duration-700"
              >
                <span className="font-sans text-[40px] leading-none text-primary/20 font-light group-hover:text-primary/40 transition-colors duration-700 select-none mb-6">
                  {point.num}
                </span>
                <h3 className="font-serif text-2xl text-foreground mb-4 group-hover:text-primary transition-colors duration-500">
                  {point.title}
                </h3>
                <p className="font-sans text-muted-foreground/60 text-sm leading-relaxed">
                  {point.description}
                </p>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}
