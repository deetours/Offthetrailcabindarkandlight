"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const revealLines = [
  { text: "Trade the noise", emph: "for the silence" },
  { text: "Stay where the", emph: "clouds rest" },
  { text: "Let the isolation", emph: "free you" },
]

// Each line gets its own component with its own scroll offset
// This avoids the "hooks in loops" React rule violation
function RevealLine({
  line,
  sectionProgress,
  enterStart,
  enterEnd,
  exitStart,
  exitEnd,
}: {
  line: { text: string; emph: string }
  sectionProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  enterStart: number
  enterEnd: number
  exitStart: number
  exitEnd: number
}) {
  // Fade in, hold, then fade out
  const lineOpacity = useTransform(
    sectionProgress,
    [enterStart, enterEnd, exitStart, exitEnd],
    [0, 1, 1, 0]
  )
  // Move it up gently as it fades in
  const lineY = useTransform(sectionProgress, [enterStart, enterEnd], [40, 0])

  return (
    <motion.p
      style={{ opacity: lineOpacity, y: lineY }}
      className="absolute inset-0 flex flex-col items-center justify-center font-serif text-[clamp(2rem,7vw,4rem)] md:text-[clamp(3rem,8vw,6.5rem)] text-foreground tracking-tightest leading-[1.05] max-w-4xl mx-auto px-6 text-center"
    >
      <span>
        {line.text} <span className="italic text-foreground/50">{line.emph}</span>
      </span>
    </motion.p>
  )
}

export function SceneReveal() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // offset: start start/end end so progress is 0 when pinned at top, 1 when fully scrolled through
    offset: ["start start", "end end"],
  })

  // Background: stays consistent, no large fade-out that creates black space
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.15])
  const bgOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 0.45, 0.45, 0]
  )

  // Overlay darkens at the start (for readability) then stays stable
  const overlayOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0.95, 0.6, 0.6, 0.95]
  )

  return (
    // 300vh allows enough space for 3 distinct text phases
    <div ref={sectionRef} className="relative min-h-[300vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        
        {/* Parallax Background */}
        <motion.div
          style={{ scale: bgScale, opacity: bgOpacity }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center grayscale-[0.4]"
            style={{
              backgroundImage: `url('/hostel-lights-mountain-roads-shared-meals-bonfire-.jpg')`,
            }}
          />
        </motion.div>

        {/* Overlay */}
        <motion.div
          style={{ opacity: overlayOpacity }}
          className="absolute inset-0 bg-background pointer-events-none"
        />

        {/* Section-blend fades */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/80 to-transparent pointer-events-none z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />

        {/* Lines — sequentially revealed in the center of the screen */}
        <div className="relative z-10 w-full h-full">
          {revealLines.map((line, i) => {
            // Sequence:
            // i=0: in(0.05->0.15) hold out(0.25->0.35)
            // i=1: in(0.35->0.45) hold out(0.55->0.65)
            // i=2: in(0.65->0.75) hold out(0.85->0.95)
            const enterStart = 0.05 + i * 0.30
            const enterEnd = enterStart + 0.10
            const exitStart = enterEnd + 0.10
            const exitEnd = exitStart + 0.10

            return (
              <RevealLine
                key={i}
                line={line}
                sectionProgress={scrollYProgress}
                enterStart={enterStart}
                enterEnd={enterEnd}
                exitStart={exitStart}
                exitEnd={exitEnd}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
