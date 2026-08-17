import { Metadata } from "next"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { RoomLedger, RoomDef } from "@/components/landing-system/room-ledger"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Jibhi Canopy Cottages | Coming Soon | Offthetrail",
  description: "A spacious multi-level stay in the canopy. Coming soon.",
}

const jibhiRooms: RoomDef[] = [
  {
    id: "duplex",
    name: "Duplex Cottage (Duplex Room)",
    description: "Spacious multi-level stay in the canopy.",
    price: 4500,
    priceLabel: "/night, incl. all taxes",
  },
  {
    id: "single",
    name: "Single Room",
    description: "Cozy retreat for solo travelers.",
    price: 2200,
    priceLabel: "/night, incl. all taxes",
  }
]

export default function JibhiCanopyCottagesPage() {
  const ownerWhatsApp = "+919999999999"
  const message = `Hello, I'm interested in Jibhi Canopy Cottages. Please notify me when bookings open!`
  const waLink = `https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`

  return (
    <main className="min-h-screen bg-background">
      <header className="absolute top-0 left-0 w-full z-50 px-6 py-8 md:px-16 lg:px-24 flex justify-between items-center pointer-events-none">
        <div className="font-serif text-2xl text-foreground font-bold tracking-tight">OffTheTrail</div>
      </header>

      <ScrollHero 
        headline="Jibhi Canopy Cottages"
        subhead="Trade the noise for silence. Deep in the canopy."
        eyebrow="Coming Soon"
        imageSrc="/hero1.png" // Placeholder
        ctaText="Notify me when bookings open"
        ctaHref={waLink}
      />

      <StoryScene 
        numeral="II — The Canopy"
        headline="Amongst the branches."
        mainImageSrc="/hero-campfire-spiti1.jpg" // Placeholder
        insetImageSrc="/hero2.png" // Placeholder
        paragraphs={[
          {
            text: "We are building something special in the canopy of Jibhi. A place where the architecture bends to the will of the forest, not the other way around. Every window frames a living painting. Every morning begins with the sound of the stream."
          }
        ]}
      />

      <section className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-background relative border-t border-border">
        {/* Background Film Grain */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{ backgroundImage: "url('/noise.png')" }}
        />
        
        <div className="max-w-4xl mx-auto mb-16 text-center relative z-10">
          <div className="font-serif text-primary text-lg lg:text-xl italic mb-4">III — Early Preview</div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">The Spaces</h2>
          <p className="mt-6 font-sans text-lg text-muted-foreground font-light max-w-xl mx-auto">
            A sneak peek at the rooms. Bookings are not yet open, but you can join the waitlist to be notified first.
          </p>
        </div>

        <div className="w-full max-w-3xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-10 shadow-2xl relative z-20">
          <RoomLedger 
            rooms={jibhiRooms} 
            interactive={false} 
          />

          <div className="pt-10 mt-6 border-t border-border flex flex-col items-center text-center">
            <h3 className="font-serif text-2xl text-foreground mb-4">Be the first to know.</h3>
            <p className="text-muted-foreground text-sm mb-8">
              We&apos;ll message you on WhatsApp the moment dates become available.
            </p>
            <a 
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary hover:brightness-110 text-primary-foreground px-8 py-4 rounded-none font-mono font-bold uppercase tracking-widest text-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Join the Waitlist <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-16 lg:px-24 bg-background border-t border-border flex flex-col items-center justify-center text-center">
        <div className="font-serif text-2xl text-foreground font-bold tracking-tight mb-4">OffTheTrail</div>
        <p className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest">© {new Date().getFullYear()} OffTheTrail. All rights reserved.</p>
      </footer>
    </main>
  )
}
