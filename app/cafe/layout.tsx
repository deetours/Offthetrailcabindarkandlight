import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "The Café at Off The Trail | Dalhousie, Himachal Pradesh",
  description:
    "A mountain café at Off The Trail Dalhousie Estate. Fresh filter coffee, local Himachali snacks, and slow mornings on Bakrota Ridge at 6,800 ft. Order in-house during your stay.",
  alternates: {
    canonical: "https://offthetrail.in/cafe",
  },
  openGraph: {
    title: "The Café | Off The Trail Dalhousie",
    description:
      "Fresh filter coffee, Himachali snacks, and slow mornings on Bakrota Ridge. Part of Off The Trail Dalhousie Estate.",
    url: "https://offthetrail.in/cafe",
    siteName: "Off The Trail",
    images: [
      {
        url: "/images/offthetrail7.jpeg",
        width: 1200,
        height: 630,
        alt: "The Café at Off The Trail Dalhousie Estate",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
}

export default function CafeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
