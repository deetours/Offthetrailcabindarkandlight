import { Metadata } from "next"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { BookingFlow } from "@/components/landing-system/booking-flow"
import { RoomDef } from "@/components/landing-system/room-ledger"
import { AmenitiesBento, AmenityDef } from "@/components/landing-system/amenities-bento"
import { LocationMap } from "@/components/landing-system/location-map"
import { SocialProofToast, ReviewDef } from "@/components/landing-system/social-proof-toast"
import { TrustBar, TrustCueDef } from "@/components/landing-system/trust-bar"
import { HostProfile, HostProfileDef } from "@/components/landing-system/host-profile"
import { PhotoGallery, GalleryPhotoDef } from "@/components/landing-system/photo-gallery"
import { MobileStickyCta } from "@/components/landing-system/mobile-sticky-cta"

export const metadata: Metadata = {
  title: "Dalhousie Estate | Offthetrail",
  description: "A heritage retreat hidden in the pine forests of Dalhousie.",
}

const dalhousieReviews: ReviewDef[] = [] // TODO: Provide 3-5 real guest reviews

const dalhousieTrustCues: TrustCueDef[] = [
  { id: "rooms", label: "10 Rooms, Independently Run", iconName: "Home" },
  { id: "response", label: "Instant Owner Response on WhatsApp", iconName: "MessageCircle" },
  { id: "secure", label: "Secure UPI Payment", iconName: "ShieldCheck" },
]

// TODO: Provide real host photo and bio to enable the HostProfile section
const dalhousieHost: HostProfileDef | null = null

// TODO: Replace with actual gallery photography from the owner
const dalhousieGallery: GalleryPhotoDef[] = [
  { id: "1", src: "/images/offthetrail7.jpeg", alt: "Dalhousie Estate Exterior", featured: true },
  { id: "2", src: "/images/offthetrail5.jpeg", alt: "Balcony View" },
  { id: "3", src: "/hero-campfire-spiti1.jpg", alt: "Campfire" },
  { id: "4", src: "/images/offthetrail7.jpeg", alt: "Property details" },
]

const dalhousieAmenities: AmenityDef[] = [
  {
    id: "heritage",
    title: "Heritage Property",
    description: "Built with stone and wood, preserving century-old architecture.",
    featured: true,
    imageSrc: "/images/offthetrail7.jpeg",
    iconName: "Castle" as const
  },
  {
    id: "trails",
    title: "Forest Trails",
    description: "Direct access to private pine forest paths.",
    iconName: "Trees" as const
  },
  {
    id: "dining",
    title: "Farm to Table",
    description: "Meals prepared with local, organic ingredients.",
    iconName: "UtensilsCrossed" as const
  },
  {
    id: "heating",
    title: "Wood-Fired Heating",
    description: "Traditional bukharis and fireplaces to keep the cold out.",
    iconName: "Flame" as const
  }
]

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
    <main className="grain min-h-screen bg-background relative overflow-x-hidden">
      <header className="absolute top-0 left-0 w-full z-50 px-6 py-8 md:px-16 lg:px-24 flex justify-between items-center pointer-events-none">
        <div className="font-serif text-2xl text-foreground font-bold tracking-tight">OffTheTrail</div>
      </header>

      <ScrollHero 
        headline="Dalhousie Estate"
        subhead="Trade the noise for silence. A heritage retreat hidden in the pine forests."
        eyebrow="10 Rooms · Dalhousie, HP · Est. Retreat"
        imageSrc="/images/offthetrail7.jpeg"
        ctaText="Book a Room"
        ctaHref="#booking-section"
      />

      <StoryScene 
        numeral="II — The Estate"
        headline="Time slows down here."
        mainImageSrc="/hero-campfire-spiti1.jpg"
        insetImageSrc="/images/offthetrail5.jpeg"
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

      <section id="booking-section" className="py-24 md:py-32 px-6 md:px-16 lg:px-24 bg-background relative">
        <div className="max-w-4xl mx-auto mb-16 text-center relative z-10">
          <div className="font-serif text-primary text-lg lg:text-xl italic mb-4">III — The Rooms</div>
          <h2 className="font-serif text-4xl md:text-5xl text-foreground">Stay with us.</h2>
        </div>

        <TrustBar cues={dalhousieTrustCues} />
        
        <HostProfile host={dalhousieHost} />

        <BookingFlow 
          propertyName="Dalhousie Estate"
          rooms={dalhousieRooms}
          qrImagePath="/images/qr-code.jpeg"
          ownerWhatsApp="+919999999999"
        />
      </section>

      {/* Photo Gallery */}
      <PhotoGallery 
        numeral="IV — The Estate in Pictures"
        headline="Quiet moments."
        subhead="A glimpse into life on the ridge."
        photos={dalhousieGallery}
      />

      {/* Amenities / Bento Grid */}
      <AmenitiesBento 
        numeral="V — The Details"
        headline="The details."
        subhead="Everything you need for a quiet retreat. Nothing you don't."
        amenities={dalhousieAmenities}
      />

      {/* Map & Location */}
      <LocationMap
        numeral="VI — Getting Here"
        headline="Getting here."
        description="Dalhousie Estate is tucked away on a quiet ridge. We'll send you exact driving directions and a pin once your booking is confirmed."
        locationTag="Dalhousie, Himachal Pradesh"
      />

      {/* FAQ */}
      <section className="py-24 px-6 md:px-16 lg:px-24 bg-card border-t border-border">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-serif text-3xl text-foreground mb-12 text-center">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="border-b border-border pb-6">
              <h4 className="font-serif text-xl text-foreground mb-3">What are the check-in and check-out times?</h4>
              <p className="text-muted-foreground font-light">Check-in is at 1:00 PM, and check-out is at 11:00 AM. Early check-in depends on availability.</p>
            </div>
            <div className="border-b border-border pb-6">
              <h4 className="font-serif text-xl text-foreground mb-3">What is the cancellation policy?</h4>
              <p className="text-muted-foreground font-light">Cancellations made 7 days prior to arrival are fully refundable. Later cancellations will incur a 1-night charge.</p>
            </div>
            <div className="border-b border-border pb-6">
              <h4 className="font-serif text-xl text-foreground mb-3">Are pets allowed?</h4>
              <p className="text-muted-foreground font-light">We love pets, but due to the surrounding wildlife, we cannot accommodate them at the estate.</p>
            </div>
            <div className="pb-6">
              <h4 className="font-serif text-xl text-foreground mb-3">Are there extra-guest charges?</h4>
              <p className="text-muted-foreground font-light">Rooms are priced for double occupancy. A third guest can be accommodated with an extra bed for ₹1,200/night.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 md:px-16 lg:px-24 bg-background border-t border-border flex flex-col items-center justify-center text-center">
        <div className="font-serif text-2xl text-foreground font-bold tracking-tight mb-4">OffTheTrail</div>
        <p className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest">© {new Date().getFullYear()} OffTheTrail. All rights reserved.</p>
      </footer>

      {/* Floating Global Components */}
      <SocialProofToast reviews={dalhousieReviews} />
      <MobileStickyCta 
        startingPrice="₹3,200/night"
        targetElementId="booking-section"
        ctaText="Check Availability"
      />
    </main>
  )
}
