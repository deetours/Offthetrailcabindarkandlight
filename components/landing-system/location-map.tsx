"use client"

import { MapPin } from "lucide-react"

interface LocationMapProps {
  numeral?: string
  headline: string
  description: string
  locationTag: string
}

export function LocationMap({ numeral, headline, description, locationTag }: LocationMapProps) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-0 relative z-10">
        
        {/* Floating Text Panel */}
        <div className="w-full md:w-[40%] relative z-20 md:-mr-12 lg:-mr-24 pt-8 md:pt-0 order-2 md:order-1">
          <div className="bg-card/95 backdrop-blur-xl border border-border p-8 md:p-12 shadow-2xl">
            {numeral && <div className="font-serif text-primary text-lg lg:text-xl italic mb-4">{numeral}</div>}
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-6">{headline}</h2>
            <p className="text-muted-foreground font-light mb-8 leading-relaxed">
              {description}
            </p>
            <div className="text-sm font-mono text-primary font-bold uppercase tracking-widest flex items-center gap-3">
              <MapPin size={18} strokeWidth={1.5} />
              {locationTag}
            </div>
          </div>
        </div>

        {/* Map / Illustration (60% width) */}
        <div className="w-full md:w-[60%] aspect-[4/3] md:aspect-auto md:h-[650px] bg-card border border-border relative overflow-hidden rounded-none order-1 md:order-2">
          {/* Abstract Map Illustration */}
          <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('/noise.png')" }} />
          
          <svg className="absolute inset-0 w-full h-full text-muted-foreground" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Topographical / Mountain lines */}
            <path d="M-100 400 Q 150 250, 400 350 T 900 200" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
            <path d="M-50 450 Q 200 300, 450 400 T 950 250" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <path d="M0 500 Q 250 350, 500 450 T 1000 300" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" fill="none" />
            
            {/* Winding road */}
            <path d="M 100 650 C 150 500, 250 450, 350 400 S 550 250, 650 150" stroke="currentColor" strokeWidth="2" strokeOpacity="0.4" strokeDasharray="8 8" fill="none" />
            
            {/* River / stream */}
            <path d="M -50 100 C 150 150, 200 300, 350 350 S 600 450, 850 550" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.1" fill="none" />
          </svg>

          {/* Location Pin */}
          <div className="absolute top-[38%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <div className="w-3 h-3 bg-primary rounded-full relative z-10 shadow-[0_0_20px_rgba(230,184,115,0.8)]" />
             <div className="w-12 h-12 bg-primary/20 rounded-full absolute animate-ping" style={{ animationDuration: '3s' }} />
             <div className="w-8 h-8 bg-primary/30 rounded-full absolute animate-pulse" style={{ animationDuration: '2s' }} />
          </div>
        </div>

      </div>
    </section>
  )
}
