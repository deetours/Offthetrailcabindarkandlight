import type { Metadata } from "next"
import { ActivitiesPage } from "@/components/activities/activities-page"

export const metadata: Metadata = {
  title: "Adventures & Activities near Dalhousie | Off The Trail",
  description:
    "Guided treks, paragliding, zipline, local village walks, and curated Himalayan experiences near Dalhousie, Himachal Pradesh. Arranged by Off The Trail for guests and independent travellers.",
  alternates: {
    canonical: "https://offthetrail.in/activities",
  },
  openGraph: {
    title: "Adventures & Activities near Dalhousie | Off The Trail",
    description:
      "Guided treks, paragliding, zipline, and Himalayan experiences near Dalhousie, HP.",
    url: "https://offthetrail.in/activities",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail8.jpeg",
        width: 1200,
        height: 630,
        alt: "Outdoor adventures near Dalhousie arranged by Off The Trail",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adventures & Activities near Dalhousie | Off The Trail",
    images: ["/images/offthetrail8.jpeg"],
  },
}

export default function Activities() {
  return <ActivitiesPage />
}
