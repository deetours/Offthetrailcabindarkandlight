import type { Metadata } from "next"
import { ExploreStaysDynamic } from "@/components/stays/explore-stays-dynamic"
import { getStays } from "@/lib/trips"

export const metadata: Metadata = {
  title: "Boutique Stays in Himachal Pradesh | Off The Trail",
  description:
    "Handpicked boutique stays in the Himalayas. Off The Trail curates mountain retreats where you arrive as a guest and leave with stories. Currently open in Dalhousie, Himachal Pradesh. From ₹3,200/night.",
  alternates: {
    canonical: "https://offthetrail.in/stays",
  },
  openGraph: {
    title: "Boutique Stays | Off The Trail",
    description:
      "Handpicked mountain retreats in Himachal Pradesh. Currently open in Dalhousie. From ₹3,200/night.",
    url: "https://offthetrail.in/stays",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "Off The Trail Boutique Stays in Himachal Pradesh",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Boutique Stays | Off The Trail",
    description: "Handpicked mountain retreats in Himachal Pradesh. From ₹3,200/night.",
    images: ["/images/offthetrail7.jpeg"],
  },
}

export default async function StaysPage() {
  const initialStays = await getStays()
  return <ExploreStaysDynamic initialStays={initialStays} />
}
