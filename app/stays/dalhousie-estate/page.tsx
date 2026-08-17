import { Metadata } from "next"
import { Navbar } from "@/components/ui/navbar"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { BookingFlow } from "@/components/landing-system/booking-flow"
import { RoomDef } from "@/components/landing-system/room-ledger"

export const metadata: Metadata = {
  title: "Dalhousie Estate | Offthetrail",
  description: "A heritage retreat hidden in the pine forests of Dalhousie.",
}

const dalhousieRooms: RoomDef[] = [
  {
    id: "super-deluxe",
    name: "Super Deluxe",
    description: "Attached balcony",
    price: 4800,
    priceLabel: "/night",
    available: 4,
    roomNumbers: "Room 01–04"
  },
  {
    id: "deluxe",
    name: "Deluxe",
    description: "Attached balcony",
    price: 4000,
    priceLabel: "/night",
    available: 2,
    roomNumbers: "Room 05–06"
  },
  {
    id: "standard",
    name: "Standard",
    description: "Window, no balcony",
    price: 3200,
    priceLabel: "/night",
    available: 4,
    roomNumbers: "Room 07–10"
  }
]

export default function DalhousieEstatePage() {
  return (
    <main className="min-h-screen bg-[#0C0F0D]">
      <Navbar visible={true} />

      <ScrollHero 
        headline="Dalhousie Estate"
        subhead="Trade the noise for silence. A heritage retreat hidden in the pine forests."
        eyebrow="10 Rooms · Dalhousie, HP · Est. Retreat"
        imageSrc="/hero1.png"
        ctaText="Book a Room"
        onCtaClick={() => {
          document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      <StoryScene 
        numeral="II — The Estate"
        headline="Time slows down here."
        mainImageSrc="/hero-campfire-spiti1.jpg"
        insetImageSrc="/hero2.png"
        paragraphs={[
          {
            text: "Built in an era when things were made to last, the estate sits on a ridge overlooking the valley. There are no televisions. No crowded lobbies. Just the sound of the wind through the deodars."
          },
          {
            text: "“We wanted to create a place where you could hear yourself think. Where the hardest decision of the day is whether to have tea on the balcony or in the garden.”",
            isQuote: true
          },
          {
            text: "Evenings are spent around the fire. Mornings begin with mist rolling through the pines. It's a place to read that book you've been carrying, to have real conversations, or to simply do nothing at all."
          }
        ]}
      />

      <section id="booking-section" className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-[#0C0F0D] relative">
        {/* Background Film Grain */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none opacity-20 mix-blend-overlay"
          style={{ backgroundImage: "url('/noise.png')" }}
        />
        
        <div className="max-w-4xl mx-auto mb-16 text-center relative z-10">
          <div className="font-serif text-[#C9A227] text-lg lg:text-xl italic mb-4">III — The Rooms</div>
          <h2 className="font-serif text-4xl md:text-5xl text-[#EDEAE2]">Stay with us.</h2>
        </div>

        <BookingFlow 
          propertyName="Dalhousie Estate"
          rooms={dalhousieRooms}
          qrImagePath="/images/qr-code.jpeg"
          ownerWhatsApp="+919999999999"
        />
      </section>

      {/* Placeholder for FAQ / Footer matching existing site */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#151A17] border-t border-[#2A332C]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl text-[#EDEAE2] mb-8">Frequently Asked Questions</h2>
          <p className="text-[#8B9A8C] font-light">
            Check-in: 1:00 PM | Check-out: 11:00 AM<br/>
            Cancellations are fully refundable up to 7 days before arrival.
          </p>
        </div>
      </section>

    </main>
  )
}
