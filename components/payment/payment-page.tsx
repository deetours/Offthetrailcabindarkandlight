"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "../ui/navbar"
import { Copy, Lock, CheckCircle2, AlertCircle } from "lucide-react"
import Image from "next/image"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  
  const [utr, setUtr] = useState("")
  const [paymentState, setPaymentState] = useState<"pending" | "verifying">("pending")
  const [copied, setCopied] = useState<"upi" | "amount" | null>(null)

  const type = searchParams.get("type")
  const id = searchParams.get("id")
  const total = searchParams.get("total")

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopy = (text: string, type: "upi" | "amount") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSubmitUTR = () => {
    if (!utr || utr.length < 6) return
    setPaymentState("verifying")
  }

  const handleWhatsApp = () => {
    const bookingPayload = sessionStorage.getItem("current_booking")
    let message = ""
    if (bookingPayload) {
      const data = JSON.parse(bookingPayload)
      message = `Hi Offthetrail! I've submitted my payment for verification.

Sanctuary: ${data.stayName}
Room: ${data.roomName}
Dates: ${data.checkIn} to ${data.checkOut}
Guests: ${data.guests}
Amount Paid: ₹${Number(data.totalPrice).toLocaleString()}
UTR / Reference: ${utr}
Status: Payment submitted for verification.

My Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}`
    } else {
      message = `Hi Offthetrail! I've submitted a payment.
Amount: ₹${total}
UTR: ${utr}
Status: Payment submitted for verification.`
    }

    const whatsappLink = `https://wa.me/917629877144?text=${encodeURIComponent(message)}`
    window.open(whatsappLink, "_blank")
  }

  return (
    <main className="grain min-h-screen bg-background">
      <Navbar visible={true} />

      <div className="px-6 pt-24 pb-12 md:px-16 lg:px-24">
        <div className="mx-auto max-w-xl">
          <div
            className={`transition-all duration-500 ease-out ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {paymentState === "pending" ? (
              <>
                <div className="text-center mb-12">
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Complete your reservation.</h1>
                  <p className="mt-2 font-serif text-xl text-muted-foreground">Scan the QR code below using any UPI app.</p>
                </div>

                <div className="rounded-2xl border border-border bg-card p-8 mb-8 relative overflow-hidden">
                  <div className="noise-overlay grayscale pointer-events-none" />
                  
                  <div className="flex flex-col items-center justify-center space-y-2 relative z-10">
                    
                    <div className="w-full text-center space-y-1 pb-4">
                      <p className="text-sm text-muted-foreground uppercase tracking-widest">Amount Due</p>
                      <p className="font-serif text-3xl text-primary">₹{Number.parseInt(total || "0").toLocaleString()}</p>
                    </div>

                    <div className="w-full flex flex-col gap-4">
                      <a
                        href={`upi://pay?pa=offthetrail@upi&pn=OffTheTrail%20Experiences&am=${total}&cu=INR`}
                        className="md:hidden w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl p-4 flex items-center justify-center gap-2 transition-colors font-bold uppercase tracking-widest text-xs"
                      >
                        Open UPI App
                      </a>

                      <div className="w-full flex gap-4">
                        <button 
                          onClick={() => handleCopy("offthetrail@upi", "upi")}
                          className="flex-1 bg-secondary/50 hover:bg-secondary border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                        >
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">UPI ID</span>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-xs md:text-sm">offthetrail@upi</span>
                            {copied === "upi" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </button>

                        <button 
                          onClick={() => handleCopy(total || "0", "amount")}
                          className="flex-1 bg-secondary/50 hover:bg-secondary border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors"
                        >
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount</span>
                          <div className="flex items-center gap-2">
                            <span className="font-serif text-xs md:text-sm">₹{Number.parseInt(total || "0").toLocaleString()}</span>
                            {copied === "amount" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="pt-6 text-center">
                      <p className="text-xs text-muted-foreground mb-4 uppercase tracking-widest">Or scan QR code</p>
                      <div className="bg-white p-2 rounded-xl inline-block relative w-32 h-32 md:w-40 md:h-40 overflow-hidden">
                        <Image src="/images/qr-code.jpeg" alt="UPI QR Code" fill className="object-cover" />
                      </div>
                      <div className="text-center space-y-1 mt-4">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Payee</p>
                        <p className="font-serif text-sm text-foreground">OffTheTrail Experiences</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card p-8 mb-8 space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40 font-bold ml-2">UTR / Transaction Reference</label>
                    <input
                      type="text"
                      value={utr}
                      onChange={(e) => setUtr(e.target.value)}
                      placeholder="e.g. 301234567890"
                      className="mt-2 w-full bg-background dark:bg-white/[0.03] border border-border dark:border-white/10 rounded-xl px-6 py-4 text-foreground focus:outline-none focus:border-primary/50 transition-all font-sans text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground mb-8">
                  <Lock className="h-3 w-3" />
                  <span>Payments are processed externally. Your booking is pending verification.</span>
                </div>

                <button
                  onClick={handleSubmitUTR}
                  disabled={!utr || utr.length < 6}
                  className="w-full rounded-full bg-primary py-5 font-bold text-primary-foreground uppercase tracking-[0.3em] text-[10px] transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed"
                >
                  Submit Payment Details
                </button>
              </>
            ) : (
              <div className="text-center space-y-8 py-12">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                
                <div className="space-y-4">
                  <h1 className="font-serif text-3xl md:text-4xl text-foreground">Payment details submitted.</h1>
                  <p className="font-serif text-lg text-muted-foreground max-w-md mx-auto">
                    Your transaction is pending verification. Please confirm with us via WhatsApp to finalize your reservation.
                  </p>
                </div>

                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-4 items-start text-left max-w-md mx-auto">
                  <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-sm text-primary/80">
                    Your booking is <strong>not confirmed</strong> until payment and room availability are explicitly verified by our team.
                  </p>
                </div>

                <button
                  onClick={handleWhatsApp}
                  className="w-full max-w-md mx-auto rounded-full bg-primary py-5 font-bold text-primary-foreground uppercase tracking-[0.3em] text-[10px] transition-all duration-300 hover:scale-[1.02]"
                >
                  Confirm on WhatsApp
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="grain min-h-screen bg-background">
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-pulse text-muted-foreground">Loading...</div>
          </div>
        </main>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
