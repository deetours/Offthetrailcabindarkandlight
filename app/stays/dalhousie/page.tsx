import { Metadata } from "next"
import DalhousieEstatePage from "../dalhousie-estate/page"

export const metadata: Metadata = {
  title: "Off The Trail Dalhousie Estate | Boutique Hotel in Dalhousie, Himachal Pradesh",
  description:
    "A 10-room boutique mountain retreat on Bakrota Ridge, Dalhousie. Pine forest views, private balconies, breakfast included, and slow mountain mornings. Direct booking from ₹3,200/night.",
  alternates: {
    canonical: "https://offthetrail.in/stays/dalhousie",
  },
  openGraph: {
    title: "Off The Trail Dalhousie Estate | Boutique Hotel, Bakrota Ridge",
    description:
      "A 10-room boutique retreat on Bakrota Ridge, Dalhousie. Pine forest views, private balconies, and slow mountain mornings. From ₹3,200/night.",
    url: "https://offthetrail.in/stays/dalhousie",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "Off The Trail Dalhousie Estate — Stone Facade on Bakrota Ridge, Himachal Pradesh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Off The Trail Dalhousie Estate | Boutique Hotel",
    description:
      "A 10-room boutique retreat on Bakrota Ridge, Dalhousie. From ₹3,200/night.",
    images: ["/images/offthetrail7.jpeg"],
  },
}

// Hotel structured data — primary commercial page
const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  "@id": "https://offthetrail.in/stays/dalhousie#hotel",
  name: "Off The Trail Dalhousie Estate",
  alternateName: "OffTheTrail Dalhousie",
  description:
    "A 10-room boutique mountain retreat on Bakrota Ridge, Dalhousie, Himachal Pradesh. Heritage stone architecture at 6,800 ft with pine forest views, private balconies, in-house dining, and high-speed Wi-Fi.",
  url: "https://offthetrail.in/stays/dalhousie",
  telephone: "+919816315898",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bakrota Ridge",
    addressLocality: "Dalhousie",
    addressRegion: "Himachal Pradesh",
    postalCode: "176304",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    // NOTE: Owner should verify exact coordinates via Google Maps pin on the property
    latitude: 32.5388,
    longitude: 75.9651,
  },
  image: [
    "https://offthetrail.in/images/offthetrail7.jpeg",
    "https://offthetrail.in/images/offthetrail5.jpeg",
    "https://offthetrail.in/images/offthetrail8.jpeg",
    "https://offthetrail.in/images/offthetrail2.jpeg",
  ],
  priceRange: "₹₹",
  checkinTime: "13:00",
  checkoutTime: "11:00",
  numberOfRooms: 10,
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Breakfast included", value: true },
    { "@type": "LocationFeatureSpecification", name: "Free parking", value: true },
    { "@type": "LocationFeatureSpecification", name: "Mountain view", value: true },
    { "@type": "LocationFeatureSpecification", name: "Room heating", value: true },
    { "@type": "LocationFeatureSpecification", name: "Private balcony", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant on site", value: true },
    { "@type": "LocationFeatureSpecification", name: "Hot water", value: true },
  ],
  containsPlace: [
    {
      "@type": "HotelRoom",
      name: "Super Deluxe Room",
      description:
        "Private balcony and a dedicated indoor seating area with pine forest views at 6,800 ft.",
      offers: {
        "@type": "Offer",
        price: "4800",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "4800",
          priceCurrency: "INR",
          unitText: "night",
        },
      },
    },
    {
      "@type": "HotelRoom",
      name: "Deluxe Room",
      description: "Attached balcony with natural wood finishes and mountain views.",
      offers: {
        "@type": "Offer",
        price: "4000",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "4000",
          priceCurrency: "INR",
          unitText: "night",
        },
      },
    },
    {
      "@type": "HotelRoom",
      name: "Standard Room",
      description:
        "Wood-panelled interiors and mountain-facing windows. Cosy and well-heated.",
      offers: {
        "@type": "Offer",
        price: "3200",
        priceCurrency: "INR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "3200",
          priceCurrency: "INR",
          unitText: "night",
        },
      },
    },
  ],
  sameAs: [
    "https://www.instagram.com/offthetrail.in/",
    "https://wa.me/919816315898",
  ],
}

// FAQPage structured data — enables rich results and AI retrieval of accurate policies
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How do I reach Off The Trail Dalhousie Estate from Pathankot or Gaggal Airport?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The nearest railway junction is Pathankot (82 km, approx. 2.5–3 hours drive). The closest airport is Gaggal/Dharamshala (105 km, approx. 3.5 hours). Metalled paved roads lead directly to our gate on Bakrota Ridge.",
      },
    },
    {
      "@type": "Question",
      name: "What meals are included at Off The Trail Dalhousie Estate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Freshly prepared breakfast is included with all room bookings, served 8:00 AM to 10:30 AM. Lunch and dinner are available from our in-house kitchen serving Himachali and North Indian meals made to order.",
      },
    },
    {
      "@type": "Question",
      name: "Does Off The Trail Dalhousie Estate have Wi-Fi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The estate has dedicated high-speed optical fiber Wi-Fi (50+ Mbps) covering bedrooms, private balconies, and common areas. Suitable for remote work and video calls.",
      },
    },
    {
      "@type": "Question",
      name: "What are the check-in and check-out times?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Standard check-in is at 1:00 PM and check-out is at 11:00 AM. Early check-in or late check-out is available when room availability permits — notify us in advance.",
      },
    },
    {
      "@type": "Question",
      name: "What is the cancellation policy at Off The Trail Dalhousie Estate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Cancellations made 7 or more days before check-in receive a 100% full refund. Cancellations within 7 days of arrival incur a 1-night retention fee, with the remainder refunded promptly.",
      },
    },
    {
      "@type": "Question",
      name: "Is there parking at Off The Trail Dalhousie Estate?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The estate has direct drive-in access via a paved road with complimentary, secure on-site parking for all guest vehicles.",
      },
    },
    {
      "@type": "Question",
      name: "How does booking work at Off The Trail Dalhousie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Book directly on offthetrail.in/stays/dalhousie for the lowest rate. You can also enquire via WhatsApp at +91 98163 15898. Payment via UPI is accepted — share your UTR number for confirmation.",
      },
    },
    {
      "@type": "Question",
      name: "Is Off The Trail Dalhousie suitable for workations or remote work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. The estate has 50+ Mbps fiber Wi-Fi, private balconies as work spots, and quiet mountain surroundings. Guests regularly run Zoom calls and remote work without interruption.",
      },
    },
  ],
}

// BreadcrumbList for this page
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://offthetrail.in/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Stays",
      item: "https://offthetrail.in/stays",
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Dalhousie Estate",
      item: "https://offthetrail.in/stays/dalhousie",
    },
  ],
}

export default function DalhousieMainDomainPage() {
  return (
    <>
      {/* Hotel + FAQPage + BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <DalhousieEstatePage />
    </>
  )
}
