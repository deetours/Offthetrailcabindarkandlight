"use client"

import { motion } from "framer-motion"
import * as Icons from "lucide-react"

export interface TrustCueDef {
  id: string
  label: string
  iconName: keyof typeof Icons
}

interface TrustBarProps {
  cues: TrustCueDef[]
}

export function TrustBar({ cues }: TrustBarProps) {
  if (!cues || cues.length === 0) return null

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          visible: {
            transition: { staggerChildren: 0.15 }
          }
        }}
        className="flex flex-wrap justify-center gap-x-8 gap-y-4 px-4 py-6 bg-card/50 border border-border rounded-xl"
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
              className="flex items-center gap-2"
            >
              {Icon && <Icon size={16} strokeWidth={1.5} className="text-primary opacity-80" />}
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-muted-foreground">{cue.label}</span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
