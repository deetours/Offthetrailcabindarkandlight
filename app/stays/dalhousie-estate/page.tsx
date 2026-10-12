import { Metadata } from "next"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { BookingFlow } from "@/components/landing-system/booking-flow"
import { RoomDef } from "@/components/landing-system/room-ledger"
import { AmenitiesBento, AmenityDef } from "@/components/landing-system/amenities-bento"
import { LocationMap, TransitPoint } from "@/components/landing-system/location-map"
import { SocialProofToast, ReviewDef } from "@/components/landing-system/social-proof-toast"
import { TrustBar, TrustCueDef } from "@/components/landing-system/trust-bar"
import { HostProfile, HostProfileDef } from "@/components/landing-system/host-profile"
import { PhotoGallery, GalleryPhotoDef } from "@/components/landing-system/photo-gallery"
import { MobileStickyCta } from "@/components/landing-system/mobile-sticky-cta"
import { EstateFaq, FaqItemDef } from "@/components/landing-system/estate-faq"

export const metadata: Metadata = {
  title: "Off The Trail Dalhousie Estate | Boutique Stay in Dalhousie",
  description: "A 10-room heritage retreat on Bakrota Ridge, Dalhousie. Pine forest views, private balconies, and slow mountain mornings. From ₹3,200/night incl. breakfast.",
}

const dalhousieReviews: ReviewDef[] = [] // TODO: Provide 3-5 real guest reviews

const dalhousieTrustCues: TrustCueDef[] = [
  { id: "rooms", label: "10 Rooms, Independently Run", iconName: "Home" },
  { id: "response", label: "Instant Owner Response on WhatsApp", iconName: "MessageCircle" },
  { id: "secure", label: "Secure UPI Payment", iconName: "ShieldCheck" },
]

// TODO: Provide real host photo and bio to enable the HostProfile section
const dalhousieHost: HostProfileDef | null = null

// Authentic Dalhousie Estate photography
const dalhousieGallery: GalleryPhotoDef[] = [
  { id: "1", src: "/images/offthetrail7.jpeg", alt: "Dalhousie Estate Colonial Stone Facade", featured: true },
  { id: "2", src: "/images/offthetrail5.jpeg", alt: "Private Wooden Balcony Facing Pine Valley" },
  { id: "3", src: "/images/offthetrail8.jpeg", alt: "Estate Walking Trail & Deodar Forest Canopy" },
  { id: "4", src: "/images/offthetrail2.jpeg", alt: "Outdoor Ridge Terrace & Sun Deck" },
]

const dalhousieAmenities: AmenityDef[] = [
  {
    id: "heritage",
    title: "Heritage Stone & Timber",
    description: "Built with dressed mountain stone and aged deodar wood, preserving century-old colonial craftsmanship at 6,800 ft.",
    featured: true,
    imageSrc: "/images/offthetrail7.jpeg",
    iconName: "Castle" as const
  },
  {
    id: "wifi",
    title: "High-Speed Fiber Wi-Fi",
    description: "Dedicated 50+ Mbps fiber connection throughout all rooms, balcony tables, and common areas for seamless remote work.",
    iconName: "Wifi" as const
  },
  {
    id: "dining",
    title: "In-House Mountain Kitchen",
    description: "Fresh daily breakfast included with every stay. Hot home-style Himachali and North Indian meals cooked to order.",
    iconName: "UtensilsCrossed" as const
  },
  {
    id: "heating",
    title: "Winter Heating & Warmth",
    description: "Radiant room heaters, thick Himalayan quilts, and electric bed warmers provided in all rooms for chilly nights.",
    iconName: "Flame" as const
  },
  {
    id: "hot-water",
    title: "24/7 Running Hot Water",
    description: "High-capacity independent geysers in all en-suite bathrooms ensure instant hot showers at any hour.",
    iconName: "Droplets" as const
  },
  {
    id: "parking",
    title: "Drive-In Road & Free Parking",
    description: "Direct paved road access right to the estate entrance with secure, complimentary on-site parking for all guest vehicles.",
    iconName: "Car" as const
  }
]

const dalhousieTransitPoints: TransitPoint[] = [
  { label: "Rail Hub", distance: "Pathankot Junction (PTK)", duration: "82 km · ~2.5 hrs drive" },
  { label: "Nearest Airport", distance: "Gaggal Airport (DHM)", duration: "105 km · ~3.5 hrs drive" },
  { label: "Town Center", distance: "Dalhousie Mall Road", duration: "3.5 km · 10 min drive" },
  { label: "Road Status", distance: "Direct Paved Road", duration: "All-weather motorable" },
]

const dalhousieFaqs: FaqItemDef[] = [
  {
    question: "How do I reach the estate from Pathankot or Gaggal Airport?",
    answer: "The nearest broad-gauge railway junction is Pathankot (82 km, approx. 2.5–3 hours scenic mountain drive). The closest airport is Gaggal / Dharamshala (105 km, approx. 3.5 hours). Metalled, all-weather paved roads lead right to our private gate. If you would like a verified local mountain cab arranged for your pickup, simply let our WhatsApp concierge know upon booking."
  },
  {
    question: "What are the meal arrangements? Is food available on-site?",
    answer: "Yes. Freshly prepared home-style breakfast is included with all room bookings and served from 8:00 AM to 10:30 AM. For lunch and dinner, our in-house kitchen prepares delicious local Himachali specialties and classic North Indian home-cooked meals made to order. Simply share your preferences a few hours in advance so our cook can prepare everything fresh."
  },
  {
    question: "Is there reliable high-speed Wi-Fi for workation / remote work?",
    answer: "Yes. The estate is connected via dedicated high-speed optical fiber Wi-Fi (50+ Mbps) covering bedrooms, private balconies, and common indoor spaces. Guests regularly run Zoom video calls, streaming, and remote work without interruptions."
  },
  {
    question: "How is room heating handled during winter and cold mountain nights?",
    answer: "At 6,800 ft elevation, evenings are crisp in spring/autumn and genuinely cold during winter. Every bedroom is equipped with powerful electric room heaters, heavy insulating quilts, and electric bed warmers. We also host evening bonfires on the outdoor terrace."
  },
  {
    question: "Can I drive my own car directly to the property? Is parking available?",
    answer: "Yes. Unlike many hill-station stays that require leaving your car on the main road and taking steep staircases, Dalhousie Estate offers direct drive-in access via a paved road. We provide complimentary, secure on-site parking on property grounds for all guest cars and SUVs."
  },
  {
    question: "How does payment and booking confirmation work?",
    answer: "We believe in direct, transparent reservations without commission markups. Once you choose your dates and room category, you can pay via any UPI app (Google Pay, PhonePe, Paytm, BHIM) using our verified QR code or UPI ID (offthetrail@upi). Share your payment screenshot on WhatsApp (+91 98163 15898), and our owner immediately issues your official reservation confirmation voucher."
  },
  {
    question: "What is your cancellation and refund policy?",
    answer: "Cancellations made 7 or more days prior to your scheduled check-in date receive a 100% full refund with zero fees. Cancellations made within 7 days of arrival incur a 1-night retention fee, and the remainder of your deposit is promptly refunded to your original payment account."
  },
  {
    question: "What are the check-in times and extra guest charges?",
    answer: "Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is gladly accommodated whenever room availability permits (notify us in advance). Published rates cover double occupancy (2 adults). A third adult or child (above 6 years) can be accommodated with an extra bed and full breakfast for ₹1,200/night."
  }
]

const dalhousieRooms: RoomDef[] = [
  {
    id: "super-deluxe",
    name: "Super Deluxe Balcony Suite",
    description: "Top-floor corner suite with a private wooden balcony offering panoramic 180° views of the pine ridge and snow peaks. Includes dedicated indoor seating area.",
    sqft: "320 sq.ft",
    bed: "King Bed",
    view: "Snow Peak & Panoramic Ridge View",
    price: 4800,
    priceLabel: "/night (incl. breakfast)",
    available: 4,
    roomNumbers: "Rooms 01–04",
    imageSrc: "/images/offthetrail5.jpeg",
    features: ["Private Balcony", "Snow Peak View", "King Bed", "En-suite Bath", "Room Heater", "Breakfast Included"]
  },
  {
    id: "deluxe",
    name: "Deluxe Balcony Room",
    description: "Middle-floor heritage room with an attached balcony opening directly into the deodar and pine canopy. Peaceful valley air with natural wood finishes.",
    sqft: "260 sq.ft",
    bed: "Queen Bed",
    view: "Pine Canopy & Valley View",
    price: 4000,
    priceLabel: "/night (incl. breakfast)",
    available: 2,
    roomNumbers: "Rooms 05–06",
    imageSrc: "/images/offthetrail3.jpeg",
    features: ["Attached Balcony", "Forest Canopy View", "Queen Bed", "En-suite Bath", "Room Heater", "Breakfast Included"]
  },
  {
    id: "standard",
    name: "Standard Heritage Room",
    description: "Cozy colonial-style ground floor room with rich pine wall paneling, large valley-facing bay windows, and quiet forest views.",
    sqft: "210 sq.ft",
    bed: "Queen Bed",
    view: "Pine Forest Window View",
    price: 3200,
    priceLabel: "/night (incl. breakfast)",
    available: 4,
    roomNumbers: "Rooms 07–10",
    imageSrc: "/images/offthetrail1.jpeg",
    features: ["Bay Window View", "Colonial Wood Interior", "Queen Bed", "En-suite Bath", "Room Heater", "Breakfast Included"]
  }
]

export default function DalhousieEstatePage() {
  return (
    <main className="grain min-h-screen bg-background relative overflow-x-hidden">
      {/* 01 · HERO: The 12-Column Editorial Grid System (Header integrated) */}
      <ScrollHero 
        propertyName="Dalhousie Estate"
        locationEyebrow="01 / DALHOUSIE, HIMACHAL PRADESH"
        headline="Dalhousie Estate"
        tagline="Trade the noise for silence."
        subhead="Ten rooms. A slower pace. A quieter side of the mountains."
        imageSrc="/images/offthetrail7.jpeg"
        ctaText="Check availability"
        ctaHref="#booking-section"
        secondaryCtaText="Explore the rooms"
        secondaryCtaHref="#booking-section"
        conciergeWhatsApp="919816315898"
        conciergePhone="+91 98163 15898"
      />

      {/* 02 · DECISION SNAPSHOT: The facts, immediately */}
      <section className="bg-card/40 border-y border-border py-8 px-6 md:px-12 lg:px-16 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-primary font-semibold mb-1">Scale & Privacy</div>
            <div className="font-serif text-lg md:text-xl text-foreground">10 Secluded Rooms</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Three categories across the ridgeline.</p>
          </div>
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-primary font-semibold mb-1">Meal Inclusions</div>
            <div className="font-serif text-lg md:text-xl text-foreground">Breakfast Included</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Fresh daily breakfast; hot local meals on order.</p>
          </div>
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-primary font-semibold mb-1">Road & Access</div>
            <div className="font-serif text-lg md:text-xl text-foreground">Drive-in & Parking</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Paved access all the way with private parking.</p>
          </div>
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.2em] text-primary font-semibold mb-1">Pricing Guarantee</div>
            <div className="font-serif text-lg md:text-xl text-foreground">From ₹3,200/night</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Transparent rates with taxes included.</p>
          </div>
        </div>
      </section>

      <StoryScene 
        numeral="II — The Estate"
        headline="Time slows down on the ridge."
        mainImageSrc="/images/offthetrail8.jpeg"
        insetImageSrc="/images/offthetrail5.jpeg"
        paragraphs={[
          {
            text: "Perched at 6,800 feet along Dalhousie’s historic Bakrota ridge, the estate was crafted from hand-cut mountain stone and seasoned deodar timber. Just ten rooms, situated quietly above the commercial bustle and traffic of the central town."
          },
          {
            text: "“We wanted to create a place where you could hear yourself think. Where the hardest decision of the day is whether to have tea on the private balcony or walk through the deodar pine woods.”",
            isQuote: true
          },
          {
            text: "Evenings are quiet, gathered around a pine fire with home-cooked mountain dinners prepared fresh in our kitchen. Mornings arrive with cold mist rising over the valley and unbroken views of the Himalayan ranges."
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
          ownerWhatsApp="+919816315898"
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
        description="Dalhousie Estate is situated on the quiet Bakrota ridge, 3.5 km above the crowded town center. A paved motorable road leads directly to our gate with private guest parking. We provide verified cab pickup coordination directly from Pathankot or Gaggal."
        locationTag="Bakrota Ridge, Dalhousie, HP (6,800 ft)"
        transitPoints={dalhousieTransitPoints}
        drivingNote="Direct vehicle access all the way. No steep uphill treks or luggage portering needed."
      />

      {/* VII — FAQ Accordion */}
      <EstateFaq 
        numeral="VII — Clarifications & Policies"
        headline="Frequently asked questions."
        subhead="Clear, honest answers regarding arrival, dining, heating, and reservations."
        items={dalhousieFaqs}
        conciergeWhatsApp="919816315898"
      />

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
