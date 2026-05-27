"use client"

import { useRef } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"

const transition = {
  duration: 1.2,
  ease: [0.23, 1, 0.32, 1] as any,
}

const sceneOptions = [
  {
    key: "stay",
    label: "Stay",
    eyebrow: "Belonging, not check-in",
    title: "Homes that slow you down.",
    description: "Shared tables, quieter mornings, and enough room for conversations to begin naturally.",
    meta: "Dorms and private rooms across mountains and coasts",
    cta: "Explore stays",
    href: "/stays",
    image: "/stays/bir-hero.jpg",
  },
  {
    key: "go",
    label: "Go",
    eyebrow: "Movement with company",
    title: "Journeys that leave room for people.",
    description: "Small groups, slower routes, and trips that feel shared instead of scheduled to the minute.",
    meta: "Curated small-group departures across India",
    cta: "Explore journeys",
    href: "/all-trips",
    image: "/mountain-road-trip-group-travelers-sunrise-himalay.jpg",
  },
]

export function SceneGoStay() {
  return (
    <section className="relative overflow-hidden px-6 py-28 md:px-12 md:py-32 lg:px-24 lg:py-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(230,184,115,0.12),transparent_35%),radial-gradient(circle_at_80%_70%,rgba(230,184,115,0.08),transparent_30%)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl lg:hidden">
        <MobileTabletScene />
      </div>

      <div className="relative z-10 hidden lg:block">
        <DesktopScene />
      </div>
    </section>
  )
}

function MobileTabletScene() {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={transition}
          className="text-[10px] uppercase tracking-[0.6em] text-primary/55 font-bold"
        >
          Choose your pace
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...transition, delay: 0.08 }}
          className="mt-6 font-serif text-[clamp(2.7rem,9vw,5rem)] leading-[0.92] tracking-tightest text-foreground"
        >
          Two ways in.
          <br />
          <span className="italic text-foreground/35">One shared rhythm.</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ ...transition, delay: 0.14 }}
          className="mx-auto mt-6 max-w-2xl font-serif text-lg md:text-2xl text-muted-foreground/65 italic lowercase leading-relaxed"
        >
          Stay for the belonging. Go for the journey. Either way, you arrive around people.
        </motion.p>
      </div>

      <div className="mt-14 grid gap-6 md:mt-16 md:grid-cols-2 md:gap-8">
        {sceneOptions.map((option, index) => (
          <StaticPane key={option.key} option={option} index={index} />
        ))}
      </div>
    </div>
  )
}

function DesktopScene() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const introOpacity = useTransform(scrollYProgress, [0, 0.05, 0.34, 0.52, 1], [0, 1, 1, 0.86, 0.58])
  const introY = useTransform(scrollYProgress, [0, 0.12], [22, 0])
  const cardsOpacity = useTransform(scrollYProgress, [0, 0.16, 0.94, 1], [1, 1, 1, 0.96])
  const cardsY = useTransform(scrollYProgress, [0, 0.18], [8, 0])
  const railGlowY = useTransform(scrollYProgress, [0.36, 0.62, 0.88], ["20%", "50%", "82%"])

  const stayScale = useTransform(scrollYProgress, [0.18, 0.34, 0.5, 0.74, 1], [0.96, 1, 1.03, 0.99, 0.96])
  const stayOpacity = useTransform(scrollYProgress, [0, 0.24, 0.86, 1], [0.98, 1, 1, 0.94])
  const stayY = useTransform(scrollYProgress, [0.26, 0.48, 0.78], [12, 0, -6])
  const stayTextOpacity = useTransform(scrollYProgress, [0, 0.28, 0.7], [0.92, 1, 1])
  const stayBorder = useTransform(scrollYProgress, [0.26, 0.42, 0.62], [0.16, 0.36, 0.22])

  const goScale = useTransform(scrollYProgress, [0.22, 0.48, 0.7, 0.9, 1], [0.95, 0.98, 1.04, 1, 0.98])
  const goOpacity = useTransform(scrollYProgress, [0, 0.3, 0.86, 1], [0.96, 0.98, 1, 0.95])
  const goY = useTransform(scrollYProgress, [0.46, 0.68, 0.86], [12, 0, -6])
  const goTextOpacity = useTransform(scrollYProgress, [0, 0.42, 0.86], [0.9, 0.96, 1])
  const goBorder = useTransform(scrollYProgress, [0.52, 0.7, 1], [0.16, 0.36, 0.24])

  return (
    <div ref={sectionRef} className="relative min-h-[152vh] xl:min-h-[160vh]">
      <div className="sticky top-0 h-screen overflow-hidden px-10 py-8">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background via-background/88 to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/72 via-background/28 to-transparent pointer-events-none z-20" />

        <div className="relative z-10 mx-auto grid h-full max-w-[1500px] grid-rows-[5rem_12.5rem_minmax(0,1fr)]">
          <div className="pointer-events-none" />

          <motion.div
            style={{ opacity: introOpacity, y: introY }}
            className="flex flex-col items-center justify-start text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.6em] text-primary/55 font-bold">Choose your pace</p>
            <h2 className="mt-5 max-w-4xl font-serif text-[clamp(2.5rem,4.4vw,4.35rem)] leading-[0.92] tracking-tightest text-foreground">
              Two ways in.
              <br />
              <span className="italic text-foreground/35">One shared rhythm.</span>
            </h2>
            <p className="mt-5 max-w-3xl font-serif text-[clamp(1rem,1.55vw,1.4rem)] text-muted-foreground/68 italic lowercase leading-[1.35]">
              Stay for the belonging. Go for the journey. Either way, you arrive around people.
            </p>
          </motion.div>

          <motion.div
            style={{ opacity: cardsOpacity, y: cardsY }}
            className="grid min-h-0 items-center pb-4 pt-2"
          >
            <div className="grid items-center gap-10 xl:grid-cols-[minmax(0,1fr)_84px_minmax(0,1fr)]">
              <AnimatedPane
                option={sceneOptions[0]}
                progress={scrollYProgress}
                scale={stayScale}
                opacity={stayOpacity}
                y={stayY}
                textOpacity={stayTextOpacity}
                borderOpacity={stayBorder}
              />

              <div className="relative hidden h-full min-h-[22rem] items-center justify-center xl:flex">
                <div className="absolute inset-y-8 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/12 to-transparent" />
                <motion.div
                  style={{ top: railGlowY }}
                  className="absolute left-1/2 h-24 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/18 blur-xl"
                />
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary/90 shadow-[0_0_24px_rgba(230,184,115,0.55)]" />
                  <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-muted-foreground/45 [writing-mode:vertical-rl]">
                    shift your pace
                  </p>
                  <div className="h-2 w-2 rounded-full bg-white/20" />
                </div>
              </div>

              <AnimatedPane
                option={sceneOptions[1]}
                progress={scrollYProgress}
                scale={goScale}
                opacity={goOpacity}
                y={goY}
                textOpacity={goTextOpacity}
                borderOpacity={goBorder}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function StaticPane({
  option,
  index,
}: {
  option: (typeof sceneOptions)[number]
  index: number
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ ...transition, delay: index * 0.08 }}
      className="relative"
    >
      <PaneShell option={option} />
    </motion.article>
  )
}

function AnimatedPane({
  option,
  progress,
  scale,
  opacity,
  y,
  textOpacity,
  borderOpacity,
}: {
  option: (typeof sceneOptions)[number]
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  scale: ReturnType<typeof useTransform<number, number>>
  opacity: ReturnType<typeof useTransform<number, number>>
  y: ReturnType<typeof useTransform<number, number>>
  textOpacity: ReturnType<typeof useTransform<number, number>>
  borderOpacity: ReturnType<typeof useTransform<number, number>>
}) {
  const imageScale =
    option.key === "stay"
      ? useTransform(progress, [0.08, 0.48, 1], [1.07, 1.02, 0.99])
      : useTransform(progress, [0.2, 0.75, 1], [1.09, 1.03, 1])

  const imageX =
    option.key === "stay"
      ? useTransform(progress, [0.08, 0.52, 1], ["-1.5%", "0%", "0.8%"])
      : useTransform(progress, [0.08, 0.72, 1], ["1.5%", "0%", "-0.8%"])

  const labelOpacity =
    option.key === "stay"
      ? useTransform(progress, [0.1, 0.24, 0.56], [0.62, 1, 0.9])
      : useTransform(progress, [0.34, 0.56, 1], [0.58, 1, 1])

  return (
    <motion.article style={{ scale, opacity, y }} className="relative">
      <PaneShell
        option={option}
        imageScale={imageScale}
        imageX={imageX}
        labelOpacity={labelOpacity}
        textOpacity={textOpacity}
        borderOpacity={borderOpacity}
        desktop
      />
    </motion.article>
  )
}

function PaneShell({
  option,
  imageScale,
  imageX,
  labelOpacity,
  textOpacity,
  borderOpacity,
  desktop = false,
}: {
  option: (typeof sceneOptions)[number]
  imageScale?: ReturnType<typeof useTransform<number, number>>
  imageX?: ReturnType<typeof useTransform<number, string>>
  labelOpacity?: ReturnType<typeof useTransform<number, number>>
  textOpacity?: ReturnType<typeof useTransform<number, number>>
  borderOpacity?: ReturnType<typeof useTransform<number, number>>
  desktop?: boolean
}) {
  return (
    <div className="glass inner-glow relative overflow-hidden rounded-[2rem] md:rounded-[2.75rem]">
      <motion.div
        style={borderOpacity ? { opacity: borderOpacity } : undefined}
        className="pointer-events-none absolute inset-0 rounded-[2rem] border border-primary/35 md:rounded-[2.75rem]"
      />

      <div className={`relative ${desktop ? "min-h-[25.5rem] xl:min-h-[27.5rem]" : "min-h-[32rem] md:min-h-[36rem]"}`}>
        <motion.div
          style={imageScale || imageX ? { scale: imageScale, x: imageX } : undefined}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center grayscale-[0.08]"
            style={{ backgroundImage: `url('${option.image}')` }}
            aria-hidden
          />
        </motion.div>

        <div className={`absolute inset-0 ${desktop ? "bg-gradient-to-t from-background/72 via-background/22 to-background/4" : "bg-gradient-to-t from-background/55 via-background/10 to-background/0"}`} />
        <div className={`absolute inset-0 ${desktop ? "bg-gradient-to-r from-background/20 via-transparent to-background/12" : "bg-gradient-to-r from-background/10 via-transparent to-background/6"}`} />

        <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-8 xl:px-10 xl:py-8">
          <motion.div style={labelOpacity ? { opacity: labelOpacity } : undefined}>
            <p className="font-sans text-[10px] uppercase tracking-[0.45em] text-primary/70 font-bold">
              {option.eyebrow}
            </p>
          </motion.div>

          <motion.div style={textOpacity ? { opacity: textOpacity } : undefined} className="max-w-[28rem]">
            <p className={`font-serif leading-[0.9] tracking-tightest text-foreground ${desktop ? "text-[clamp(3.2rem,4.8vw,5rem)]" : "text-[clamp(2.8rem,10vw,4.25rem)]"}`}>
              {option.label}
            </p>
            <h3 className={`mt-3 font-serif leading-[1] tracking-tightest text-foreground/94 ${desktop ? "text-[clamp(2.2rem,3vw,3.8rem)]" : "text-[clamp(2rem,7vw,3rem)]"}`}>
              {option.title}
            </h3>
            <p className={`mt-5 max-w-md font-sans leading-relaxed text-muted-foreground/88 ${desktop ? "text-base" : "text-[15px] md:text-base"}`}>
              {option.description}
            </p>
          </motion.div>

          <motion.div
            style={textOpacity ? { opacity: textOpacity } : undefined}
            className="flex flex-col items-start gap-5 border-t border-white/10 pt-6"
          >
            <p className="max-w-sm font-sans text-[10px] uppercase tracking-[0.34em] text-muted-foreground/62">
              {option.meta}
            </p>
            <Link
              href={option.href}
              className="group inline-flex items-center gap-3 rounded-full border border-primary/25 bg-background/40 px-6 py-3 font-sans text-[10px] uppercase tracking-[0.45em] text-foreground transition-all duration-500 hover:border-primary/45 hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span>{option.cta}</span>
              <motion.span
                initial={false}
                whileHover={{ x: 4 }}
                transition={transition}
                className="text-primary group-hover:text-primary-foreground"
              >
                →
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
