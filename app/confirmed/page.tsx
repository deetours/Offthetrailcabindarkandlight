import { ConfirmedPage } from "@/components/confirmed/confirmed-page"

export const metadata = {
  robots: { index: false, follow: false },
  title: "Booking Status | Offthetrail",
  description: "Review the verification status of your booking or payment.",
}

export default function Confirmed() {
  return <ConfirmedPage />
}
