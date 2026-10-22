import type { Metadata } from "next"
import { ExploreTrips } from "@/components/trips/explore-trips"

export const metadata: Metadata = {
  title: "Curated Group Trips in Himachal Pradesh & India | Off The Trail",
  description:
    "Small-group trips to Spiti Valley, Bir Billing, Gokarna, Ladakh, and Himachal Pradesh. Curated by Off The Trail for slow travellers. No rush. Big landscapes. Real people.",
  alternates: {
    canonical: "https://offthetrail.in/trips",
  },
  openGraph: {
    title: "Curated Group Trips | Off The Trail",
    description:
      "Small-group trips to Spiti, Bir, Ladakh, Gokarna, and more. Curated for slow travellers.",
    url: "https://offthetrail.in/trips",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/spiti1.jpg",
        width: 1200,
        height: 630,
        alt: "Curated group trips to Spiti Valley by Off The Trail",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Curated Group Trips | Off The Trail",
    images: ["/images/spiti1.jpg"],
  },
}

export default function TripsPage() {
  return <ExploreTrips />
}
