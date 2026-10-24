import { Metadata } from "next"
import { ScrollHero } from "@/components/landing-system/scroll-hero"
import { StoryScene } from "@/components/landing-system/story-scene"
import { RoomBookingBridge } from "@/components/landing-system/room-booking-bridge"
import { RoomDef } from "@/components/landing-system/room-ledger"
import { AmenitiesBento, AmenityDef } from "@/components/landing-system/amenities-bento"
import { LocationMap, TransitPoint } from "@/components/landing-system/location-map"
import { SocialProofToast, ReviewDef } from "@/components/landing-system/social-proof-toast"
import { TrustCueDef } from "@/components/landing-system/trust-bar"
import { HostProfileDef } from "@/components/landing-system/host-profile"
import { PhotoGallery, GalleryPhotoDef } from "@/components/landing-system/photo-gallery"
import { MobileStickyCta } from "@/components/landing-system/mobile-sticky-cta"
import { EstateFaq, FaqItemDef } from "@/components/landing-system/estate-faq"

export const metadata: Metadata = {
  title: "Off The Trail Dalhousie Estate | Boutique Stay in Dalhousie",
  description: "A 10-room heritage retreat on Bakrota Ridge, Dalhousie. Pine forest views, private balconies, and slow mountain mornings. From ₹3,200/night.",
  alternates: {
    canonical: "https://offthetrail.in/stays/dalhousie",
  },
  openGraph: {
    title: "Off The Trail Dalhousie Estate",
    description: "A 10-room heritage retreat on Bakrota Ridge, Dalhousie. Pine forest views, private balconies, and slow mountain mornings. From ₹3,200/night.",
    url: "https://offthetrail.in/stays/dalhousie",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "Dalhousie Estate Colonial Stone Facade",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Off The Trail Dalhousie Estate",
    description: "A 10-room heritage retreat on Bakrota Ridge, Dalhousie. From ₹3,200/night.",
    images: ["/images/offthetrail7.jpeg"],
  },
}

const dalhousieReviews: ReviewDef[] = [] // TODO: Provide 3-5 real guest reviews

const dalhousieTrustCues: TrustCueDef[] = [
  { 
    id: "rooms", 
    label: "10 Secluded Rooms", 
    description: "Independently run on Bakrota Ridge",
    iconName: "Home" 
  },
  { 
    id: "access", 
    label: "Drive-In & Parking", 
    description: "Paved road with private parking",
    iconName: "Car" 
  },
  { 
    id: "breakfast", 
    label: "Breakfast Included", 
    description: "Fresh hot breakfast with every stay",
    iconName: "UtensilsCrossed" 
  },
  { 
    id: "concierge", 
    label: "Owner Verified", 
    description: "Instant WhatsApp communication",
    iconName: "MessageCircle" 
  },
]

// TODO: Provide real host photo and bio to enable the HostProfile section
const dalhousieHost: HostProfileDef | null = null

// Authentic Dalhousie Estate photography
const dalhousieGallery: GalleryPhotoDef[] = [
  { id: "1", src: "/images/offthetrail7.jpeg", alt: "Dalhousie Estate Colonial Stone Facade", featured: true },
  { id: "2", src: "/images/offthetrail5.jpeg", alt: "Private Balcony Facing Pine Valley" },
  { id: "3", src: "/images/offthetrail8.jpeg", alt: "Estate Walking Trail & Deodar Forest Canopy" },
  { id: "4", src: "/images/offthetrail2.jpeg", alt: "Outdoor Ridge Terrace & Sun Deck" },
]

const dalhousieAmenities: AmenityDef[] = [
  {
    id: "heritage",
    title: "Mountain Stone & Ridge Terrace",
    description: "Natural stone architecture and open terrace seating at 6,800 ft, framed by deodar pines for slow morning tea and sunset views.",
    featured: true,
    imageSrc: "/images/offthetrail7.jpeg",
    iconName: "Mountain" as const
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
    answer: "We offer direct, commission-free reservations. Select your dates and room category in our stay planner, then click 'Continue on WhatsApp'. Your enquiry goes directly to our team on WhatsApp (+91 98163 15898), where our concierge verifies availability, answers questions, coordinates payment details, and issues your confirmed booking voucher."
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
    name: "Super Deluxe Room",
    description: "A private balcony and a dedicated indoor seating area.",
    price: 4800,
    priceLabel: "/night (incl. breakfast)",
    imageSrc: "/images/offthetrail5.jpeg"
  },
  {
    id: "deluxe",
    name: "Deluxe Room",
    description: "An attached balcony and natural wood finishes.",
    price: 4000,
    priceLabel: "/night (incl. breakfast)",
    imageSrc: "/images/offthetrail3.jpeg"
  },
  {
    id: "standard",
    name: "Standard Room",
    description: "Wood-panelled interiors and windows.",
    price: 3200,
    priceLabel: "/night (incl. breakfast)",
    imageSrc: "/images/offthetrail1.jpeg"
  }
]

export default function DalhousieEstatePage() {
  return (
    <main className="grain min-h-screen bg-background relative overflow-x-hidden pb-28 md:pb-0">
      {/* 01 · HERO: Scene 01 (The Invitation: Escape & Aspiration) */}
      <ScrollHero 
        propertyName="Dalhousie Estate"
        locationEyebrow="BAKROTA RIDGE · DALHOUSIE, 6,800 FT"
        headline={"Find your\nquiet in the pines."}
        subhead="A comfortable mountain stay with warm interiors, forest surroundings and room to slow down."
        startingPrice="From ₹3,200 / night · Breakfast included"
        imageSrc="/images/offthetrail7.jpeg"
        ctaText="Explore the rooms"
        ctaHref="#rooms"
        conciergeWhatsApp={process.env.NEXT_PUBLIC_OFFTHETRAIL_WA_NUMBER || "919816315898"}
        conciergePhone="+91 98163 15898"
      />

      {/* 02 · DECISION SNAPSHOT: The facts, immediately */}
      <section className="bg-card/40 border-y border-border py-8 px-6 md:px-12 lg:px-16 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-primary font-semibold mb-1">Scale & Privacy</div>
            <div className="font-serif text-lg md:text-xl text-foreground">10 Secluded Rooms</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Three categories across the ridgeline.</p>
          </div>
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-primary font-semibold mb-1">Meal Inclusions</div>
            <div className="font-serif text-lg md:text-xl text-foreground">Breakfast Included</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Fresh daily breakfast; hot local meals on order.</p>
          </div>
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-primary font-semibold mb-1">Road & Access</div>
            <div className="font-serif text-lg md:text-xl text-foreground">Drive-in & Parking</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Paved access all the way with private parking.</p>
          </div>
          <div>
            <div className="text-[11px] font-sans uppercase tracking-[0.16em] text-primary font-semibold mb-1">Pricing Guarantee</div>
            <div className="font-serif text-lg md:text-xl text-foreground">From ₹3,200/night</div>
            <p className="text-xs text-muted-foreground font-light mt-1">Transparent rates with breakfast included.</p>
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

      {/* Chapters III & IV: Dedicated Room Catalogue & Booking Engine */}
      <RoomBookingBridge 
        propertyName="Dalhousie Estate"
        rooms={dalhousieRooms}
        trustCues={dalhousieTrustCues}
        host={dalhousieHost}
        qrImagePath="/images/qr-code.jpeg"
        ownerWhatsApp={process.env.NEXT_PUBLIC_OFFTHETRAIL_WA_NUMBER || "919816315898"}
      />

      {/* Chapter V: Photo Gallery */}
      <PhotoGallery 
        numeral="V — The Estate in Pictures"
        headline="Quiet moments."
        subhead="A glimpse into life on the ridge."
        photos={dalhousieGallery}
      />

      {/* Chapter VI: Amenities / Bento Grid */}
      <AmenitiesBento 
        numeral="VI — The Practical Details"
        headline="The details."
        subhead="Everything you need for a quiet retreat. Nothing you don't."
        amenities={dalhousieAmenities}
      />

      {/* Chapter VII: Map & Location */}
      <LocationMap
        numeral="VII — Getting Here"
        headline="Getting here."
        description="Dalhousie Estate is situated on the quiet Bakrota ridge, 3.5 km above the crowded town center. A paved motorable road leads directly to our gate with private guest parking. We provide verified cab pickup coordination directly from Pathankot or Gaggal."
        locationTag="Bakrota Ridge, Dalhousie, HP (6,800 ft)"
        transitPoints={dalhousieTransitPoints}
        drivingNote="Direct vehicle access all the way. No steep uphill treks or luggage portering needed."
      />

      {/* Chapter VIII: FAQ Accordion */}
      <EstateFaq 
        numeral="VIII — Clarifications & Policies"
        headline="Frequently asked questions."
        subhead="Clear, honest answers regarding arrival, dining, heating, and reservations."
        items={dalhousieFaqs}
        conciergeWhatsApp={process.env.NEXT_PUBLIC_OFFTHETRAIL_WA_NUMBER || "919816315898"}
      />

      <footer className="py-12 px-6 md:px-12 lg:px-16 bg-background border-t border-border flex flex-col items-center justify-center text-center space-y-3">
        <div className="font-serif text-2xl text-foreground font-bold tracking-tight">OffTheTrail</div>
        <address className="not-italic text-xs text-muted-foreground">
          <span>Bakrota Ridge, Dalhousie, Himachal Pradesh 176304, India</span>
          {" · "}
          <a href="tel:+919816315898" className="hover:text-foreground transition-colors">+91 98163 15898</a>
        </address>
        <p className="text-muted-foreground text-xs font-mono font-bold uppercase tracking-widest">© {new Date().getFullYear()} OffTheTrail. All rights reserved.</p>
      </footer>

      {/* Floating Global Components */}
      <SocialProofToast reviews={dalhousieReviews} />
      <MobileStickyCta 
        startingPrice="₹3,200/night"
        targetElementId="rooms"
        ctaText="Explore the rooms"
      />
    </main>
  )
}
