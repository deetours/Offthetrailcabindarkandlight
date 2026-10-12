"use client"

import { MapPin } from "lucide-react"

export interface TransitPoint {
  label: string
  distance: string
  duration: string
}

interface LocationMapProps {
  numeral?: string
  headline: string
  description: string
  locationTag: string
  transitPoints?: TransitPoint[]
  drivingNote?: string
}

export function LocationMap({ 
  numeral, 
  headline, 
  description, 
  locationTag,
  transitPoints,
  drivingNote
}: LocationMapProps) {
  return (
    <section className="py-24 md:py-32 px-6 md:px-12 lg:px-16 bg-background relative border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-0 relative z-10">
        
        {/* Floating Text Panel */}
        <div className="w-full md:w-[48%] lg:w-[45%] relative z-20 md:-mr-12 lg:-mr-20 pt-8 md:pt-0 order-2 md:order-1">
          <div className="bg-card/95 backdrop-blur-xl border border-border p-8 md:p-12 shadow-2xl">
            {numeral && <div className="font-serif text-primary text-lg lg:text-xl italic mb-3">{numeral}</div>}
            <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-5">{headline}</h2>
            <p className="text-muted-foreground font-light mb-6 leading-relaxed">
              {description}
            </p>

            {/* Concrete Transit Distances */}
            {transitPoints && transitPoints.length > 0 && (
              <div className="grid grid-cols-2 gap-4 my-6 pt-6 border-t border-border">
                {transitPoints.map((tp, i) => (
                  <div key={i} className="flex flex-col">
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-[0.18em] text-primary">{tp.label}</span>
                    <span className="font-serif text-foreground text-sm mt-0.5 font-medium">{tp.distance}</span>
                    <span className="text-muted-foreground text-xs font-light">{tp.duration}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Driving / Arrival Guarantee */}
            {drivingNote && (
              <div className="text-xs text-neutral-300 font-sans border-l-2 border-primary/60 pl-3 py-1 my-5 bg-background/40">
                {drivingNote}
              </div>
            )}

            <div className="text-xs font-sans text-primary font-semibold uppercase tracking-[0.2em] flex items-center gap-2.5 pt-2">
              <MapPin size={16} strokeWidth={2} />
              <span>{locationTag}</span>
            </div>
          </div>
        </div>

        {/* Map / Route Illustration (55% width) */}
        <div className="w-full md:w-[58%] lg:w-[60%] aspect-[4/3] md:aspect-auto md:h-[650px] bg-card border border-border relative overflow-hidden rounded-none order-1 md:order-2">
          
          <svg className="absolute inset-0 w-full h-full text-muted-foreground" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Topographical / Mountain contours */}
            <path d="M-100 400 Q 150 250, 400 350 T 900 200" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.15" fill="none" />
            <path d="M-50 450 Q 200 300, 450 400 T 950 250" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" fill="none" />
            <path d="M0 500 Q 250 350, 500 450 T 1000 300" stroke="currentColor" strokeWidth="1" strokeOpacity="0.05" fill="none" />
            
            {/* Mountain Ridge lines */}
            <path d="M 200 150 L 350 220 L 500 130 L 650 210 L 800 120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.12" fill="none" />
            
            {/* Winding mountain road from Pathankot up to Bakrota */}
            <path d="M 100 580 C 180 500, 220 460, 320 420 S 420 320, 470 260 S 520 220, 560 180" stroke="currentColor" strokeWidth="2" strokeOpacity="0.45" strokeDasharray="6 6" fill="none" />
            
            {/* Landmark 1: Pathankot Foothills */}
            <circle cx="100" cy="580" r="4" fill="currentColor" fillOpacity="0.5" />
            <text x="115" y="584" fill="currentColor" fillOpacity="0.6" fontSize="11" fontFamily="sans-serif" letterSpacing="0.1em">PATHANKOT (82 KM)</text>
            
            {/* Landmark 2: Banikhet */}
            <circle cx="320" cy="420" r="3" fill="currentColor" fillOpacity="0.4" />
            <text x="335" y="424" fill="currentColor" fillOpacity="0.5" fontSize="10" fontFamily="sans-serif" letterSpacing="0.08em">BANIKHET PASS</text>
            
            {/* Landmark 3: Dalhousie Town */}
            <circle cx="470" cy="260" r="3.5" fill="currentColor" fillOpacity="0.5" />
            <text x="360" y="264" fill="currentColor" fillOpacity="0.6" fontSize="10" fontFamily="sans-serif" letterSpacing="0.08em">MALL ROAD (3.5 KM)</text>

            {/* Landmark 4: Bakrota Ridge Altitude Tag */}
            <text x="590" y="175" className="fill-primary" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.12em">BAKROTA RIDGE (6,800 FT)</text>
          </svg>

          {/* Destination Pin: Dalhousie Estate */}
          <div className="absolute top-[30%] left-[70%] -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
             <div className="w-3.5 h-3.5 bg-primary rounded-full relative z-10 shadow-[0_0_24px_rgba(230,184,115,0.9)]" />
             <div className="w-14 h-14 bg-primary/20 rounded-full absolute animate-ping" style={{ animationDuration: '3s' }} />
             <div className="w-9 h-9 bg-primary/30 rounded-full absolute animate-pulse" style={{ animationDuration: '2s' }} />
          </div>

          {/* Map Overlay Badge */}
          <div className="absolute bottom-6 right-6 z-10 bg-background/80 backdrop-blur-md border border-border px-4 py-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Drive-In Accessible · Free Parking
          </div>
        </div>

      </div>
    </section>
  )
}

