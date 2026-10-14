"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"

export interface TrustCueDef {
  id: string
  label: string
  description?: string
  iconName: keyof typeof Icons
}

interface TrustBarProps {
  cues: TrustCueDef[]
}

export function TrustBar({ cues }: TrustBarProps) {
  if (!cues || cues.length === 0) return null

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.1 }
          }
        }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 bg-card/60 border border-border/80 rounded-[4px] shadow-sm backdrop-blur-sm"
      >
        {cues.map((cue) => {
          const Icon = Icons[cue.iconName] as any
          return (
            <motion.div
              key={cue.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="flex flex-col items-center text-center p-2 rounded-[2px]"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2 border border-primary/20 shrink-0">
                {Icon && <Icon size={15} strokeWidth={1.75} />}
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground mb-0.5">
                {cue.label}
              </span>
              {cue.description && (
                <span className="text-[11px] font-sans text-muted-foreground font-light leading-snug">
                  {cue.description}
                </span>
              )}
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
