import type { Metadata } from "next"
import { AboutPage } from "@/components/about/about-page"

export const metadata: Metadata = {
  title: "About Off The Trail | Boutique Mountain Hospitality, Dalhousie",
  description:
    "Off The Trail was built for travellers who value silence, simplicity, and genuine mountain hospitality. Learn our story, values, and the people behind the estate in Dalhousie, Himachal Pradesh.",
  alternates: {
    canonical: "https://offthetrail.in/about",
  },
  openGraph: {
    title: "About Off The Trail | Boutique Mountain Hospitality",
    description:
      "Built for travellers who value silence, simplicity, and mountain hospitality. Dalhousie, Himachal Pradesh, India.",
    url: "https://offthetrail.in/about",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "Off The Trail Dalhousie Estate",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Off The Trail",
    description:
      "Built for travellers who value silence and mountain hospitality. Dalhousie, Himachal Pradesh.",
    images: ["/images/offthetrail7.jpeg"],
  },
}

export default function About() {
  return <AboutPage />
}
