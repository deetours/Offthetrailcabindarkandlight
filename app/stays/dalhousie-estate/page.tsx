import { Metadata } from "next"
import { Navbar } from "@/components/ui/navbar"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { BookingFlow } from "@/components/landing-system/booking-flow"
import { RoomDef } from "@/components/landing-system/room-ledger"
import { Footer } from "@/components/ui/footer"

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

      {/* Amenities / Bento Grid */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#151A17] border-t border-[#2A332C]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl text-[#EDEAE2] mb-6">The details.</h2>
            <p className="text-[#8B9A8C] font-light max-w-lg mx-auto">
              Everything you need for a quiet retreat. Nothing you don't.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[200px]">
            <div className="md:col-span-2 bg-[#0C0F0D] p-8 border border-[#2A332C] flex flex-col justify-end">
              <h3 className="font-serif text-2xl text-[#EDEAE2] mb-2">Heritage Property</h3>
              <p className="text-[#8B9A8C] text-sm">Built with stone and wood, preserving century-old architecture.</p>
            </div>
            <div className="bg-[#0C0F0D] p-8 border border-[#2A332C] flex flex-col justify-end">
              <h3 className="font-serif text-2xl text-[#EDEAE2] mb-2">Forest Trails</h3>
              <p className="text-[#8B9A8C] text-sm">Direct access to private pine forest paths.</p>
            </div>
            <div className="bg-[#0C0F0D] p-8 border border-[#2A332C] flex flex-col justify-end">
              <h3 className="font-serif text-2xl text-[#EDEAE2] mb-2">Farm to Table</h3>
              <p className="text-[#8B9A8C] text-sm">Meals prepared with local, organic ingredients.</p>
            </div>
            <div className="md:col-span-2 bg-[#0C0F0D] p-8 border border-[#2A332C] flex flex-col justify-end">
              <h3 className="font-serif text-2xl text-[#EDEAE2] mb-2">Wood-Fired Heating</h3>
              <p className="text-[#8B9A8C] text-sm">Traditional bukharis and fireplaces to keep the cold out.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map & Location */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#0C0F0D]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/3">
            <h2 className="font-serif text-3xl text-[#EDEAE2] mb-6">Getting here.</h2>
            <p className="text-[#8B9A8C] font-light mb-8">
              Dalhousie Estate is tucked away on a quiet ridge. We'll send you exact driving directions and a pin once your booking is confirmed.
            </p>
            <div className="text-sm font-mono text-[#C9A227] uppercase tracking-widest">
              Dalhousie, Himachal Pradesh
            </div>
          </div>
          <div className="w-full md:w-2/3 aspect-video bg-[#151A17] border border-[#2A332C] relative overflow-hidden">
            {/* Minimal static map aesthetic */}
            <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{ backgroundImage: "url('/noise.png')" }} />
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d108422.56947214643!2d75.90802778330756!3d32.53924619940733!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391c7128522eeb37%3A0xe19f96b65825228!2sDalhousie%2C%20Himachal%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0, filter: 'grayscale(100%) invert(90%) contrast(80%)' }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-[#151A17] border-t border-[#2A332C]">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-[#EDEAE2] mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="border-b border-[#2A332C] pb-6">
              <h4 className="font-serif text-xl text-[#EDEAE2] mb-3">What are the check-in and check-out times?</h4>
              <p className="text-[#8B9A8C] font-light">Check-in is at 1:00 PM, and check-out is at 11:00 AM. Early check-in depends on availability.</p>
            </div>
            <div className="border-b border-[#2A332C] pb-6">
              <h4 className="font-serif text-xl text-[#EDEAE2] mb-3">What is the cancellation policy?</h4>
              <p className="text-[#8B9A8C] font-light">Cancellations made 7 days prior to arrival are fully refundable. Later cancellations will incur a 1-night charge.</p>
            </div>
            <div className="border-b border-[#2A332C] pb-6">
              <h4 className="font-serif text-xl text-[#EDEAE2] mb-3">Are pets allowed?</h4>
              <p className="text-[#8B9A8C] font-light">We love pets, but due to the surrounding wildlife, we cannot accommodate them at the estate.</p>
            </div>
            <div className="pb-6">
              <h4 className="font-serif text-xl text-[#EDEAE2] mb-3">Are there extra-guest charges?</h4>
              <p className="text-[#8B9A8C] font-light">Rooms are priced for double occupancy. A third guest can be accommodated with an extra bed for ₹1,200/night.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
