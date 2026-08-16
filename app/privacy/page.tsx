import Link from "next/link"

export const metadata = {
  title: "Privacy | Offthetrail",
  description: "How Offthetrail handles booking, enquiry, cafe, and account information.",
}

const sections = [
  {
    title: "What we collect",
    body: "We collect the details you provide while making an enquiry, booking a stay, placing a cafe order, or creating an account. This can include your name, contact details, travel dates, guest counts, order details, and payment references shared for manual verification.",
  },
  {
    title: "Why we use it",
    body: "We use this information to respond to enquiries, coordinate reservations, verify submitted payments, manage customer accounts, and support on-property operations such as cafe orders and guest communication.",
  },
  {
    title: "How it is handled",
    body: "Customer information is intended to be used for operational communication and service delivery. Access to protected routes and private records should remain restricted to the appropriate customer or authorised team member.",
  },
  {
    title: "Contact",
    body: "If you need help with your data or want clarification about a reservation or payment reference, contact Offthetrail directly before sharing any additional sensitive information.",
  },
]

export default function PrivacyPage() {
  return (
    <main className="grain min-h-screen bg-background px-6 pb-24 pt-32 md:px-16 lg:px-24">
      <div className="mx-auto max-w-3xl space-y-12">
        <div className="space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-primary/70">Privacy</p>
          <h1 className="font-serif text-4xl text-foreground md:text-6xl">Your details should stay in the right hands.</h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            This page explains, at a high level, how Offthetrail uses information shared through bookings, enquiries, cafe orders, and returning-customer flows.
          </p>
        </div>

        <div className="space-y-6">
          {sections.map((section) => (
            <section key={section.title} className="rounded-3xl border border-border bg-card/70 p-8">
              <h2 className="font-serif text-2xl text-foreground">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground md:text-base">{section.body}</p>
            </section>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <Link href="/" className="text-primary transition-colors hover:text-primary/80">
            Return home
          </Link>
          <Link href="/terms" className="text-primary transition-colors hover:text-primary/80">
            Read terms
          </Link>
        </div>
      </div>
    </main>
  )
}
