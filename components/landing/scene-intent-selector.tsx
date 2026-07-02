"use client"

import { motion } from "framer-motion"
import { Compass, MapPin } from "lucide-react"

interface SceneIntentSelectorProps {
  onOpenModal: (tab: "stay" | "adventure") => void
}

export function SceneIntentSelector({ onOpenModal }: SceneIntentSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="absolute bottom-12 left-1/2 md:left-[56%] -translate-x-1/2 w-full max-w-md px-6 z-30"
    >
      <div className="flex flex-col md:flex-row bg-black/60 md:bg-black/40 backdrop-blur-xl border border-white/10 rounded-[1.5rem] md:rounded-2xl p-2 shadow-2xl gap-2 md:gap-0">
        <button
          onClick={() => onOpenModal("stay")}
          className="flex-1 flex items-center justify-center gap-3 py-4 md:py-3.5 px-4 rounded-[1.25rem] md:rounded-xl bg-white/10 md:bg-transparent text-white md:text-white/90 hover:bg-white/20 md:hover:bg-white/10 hover:text-white transition-all group"
        >
          <MapPin className="w-5 h-5 md:w-4 md:h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm md:text-xs font-bold uppercase tracking-widest">Find a Stay</span>
        </button>
        <div className="hidden md:block w-[1px] bg-white/10 my-2 mx-1" />
        <button
          onClick={() => onOpenModal("adventure")}
          className="flex-1 flex items-center justify-center gap-3 py-4 md:py-3.5 px-4 rounded-[1.25rem] md:rounded-xl border border-white/5 md:border-transparent text-white/70 md:text-white/90 hover:bg-white/5 md:hover:bg-white/10 hover:text-white transition-all group"
        >
          <Compass className="w-5 h-5 md:w-4 md:h-4 text-primary group-hover:scale-110 transition-transform" />
          <span className="text-sm md:text-xs font-bold uppercase tracking-widest">Adventure</span>
        </button>
      </div>
    </motion.div>
  )
}
