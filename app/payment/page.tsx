import { PaymentPage } from "@/components/payment/payment-page"

export const metadata = {
  robots: { index: false, follow: false },
  title: "Payment | Offthetrail",
  description: "Complete your booking",
}

export default function Payment() {
  return <PaymentPage />
}
