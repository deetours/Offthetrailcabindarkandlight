"use client"

import { useState } from "react"
import { X, ShoppingBag, Send, QrCode, Copy, CheckCircle2, Lock, AlertCircle, ArrowLeft } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CartItem } from "./cafe-menu"

interface CafeCartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cart: CartItem[]
  onRemoveItem: (id: string) => void
}

export function CafeCartDrawer({ isOpen, onClose, cart, onRemoveItem }: CafeCartDrawerProps) {
  const [step, setStep] = useState<"details" | "payment" | "submitted">("details")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [orderMode, setOrderMode] = useState<"dine-in" | "room-service" | "pickup">("dine-in")
  const [locationInfo, setLocationInfo] = useState("")
  const [utr, setUtr] = useState("")
  const [copied, setCopied] = useState<"upi" | "amount" | null>(null)

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCopy = (text: string, type: "upi" | "amount") => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (cart.length === 0 || !name || !phone) return
    setStep("payment")
  }

  const handleSubmitOrder = () => {
    if (!utr || utr.length < 6) return
    setStep("submitted")
  }

  const handleWhatsAppFallback = () => {
    const orderDetails = cart.map((item) => `${item.quantity}x ${item.name} (Rs.${item.price})`).join("\n")
    const message = `Cafe Order Enquiry\n\nName: ${name}\nPhone: ${phone}\nMode: ${orderMode}\nLocation/Table: ${locationInfo || "N/A"}\n\nOrder:\n${orderDetails}\n\nEstimated Total: Rs.${subtotal}\nUTR: ${utr}\nStatus: Order submitted, payment pending verification.`

    const link = `https://wa.me/917629877144?text=${encodeURIComponent(message)}`
    window.open(link, "_blank")
    onClose()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => setStep("details"), 300)
      onClose()
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md border-l border-border p-0 flex flex-col bg-background/95 backdrop-blur-xl max-md:h-[100dvh] max-md:max-w-none">
        <SheetHeader className="p-6 border-b border-border">
          <div className="flex items-center gap-4">
            <button onClick={() => {
              if (step === "payment") {
                setStep("details")
              } else {
                onClose()
              }
            }} className="p-2 hover:bg-secondary rounded-full transition-colors md:hidden" aria-label="Back or Close">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </button>
            <SheetTitle className="font-serif text-2xl text-foreground flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" /> Your Order
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32 no-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-4">
              <ShoppingBag className="w-12 h-12 opacity-20" />
              <p className="text-sm font-medium">Your tray is empty.</p>
            </div>
          ) : (
            <>
              {step !== "submitted" && (
                <div className="space-y-4 mb-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start border-b border-border pb-4">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{item.name}</h4>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity} x Rs.{item.price}</p>
                      </div>
                      {step === "details" && (
                        <button onClick={() => onRemoveItem(item.id)} className="text-muted-foreground hover:text-red-400 p-1 md:p-0">
                          <X className="w-5 h-5 md:w-4 md:h-4" />
                        </button>
                      )}
                    </div>
                  ))}

                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <span className="text-sm uppercase tracking-widest font-bold text-muted-foreground">Estimated Total</span>
                    <span className="text-xl font-serif text-primary">Rs.{subtotal}</span>
                  </div>
                </div>
              )}

              {step === "details" && cart.length > 0 && (
                <form id="checkout-form" onSubmit={handleProceedToPayment} className="space-y-6 pt-4 border-t border-border animate-in fade-in slide-in-from-right-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Details</h3>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Order Mode *</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["dine-in", "room-service", "pickup"] as const).map((mode) => (
                        <button
                          key={mode}
                          type="button"
                          onClick={() => setOrderMode(mode)}
                          className={`py-3 md:py-2 text-[10px] uppercase tracking-wider rounded-lg border transition-all ${orderMode === mode ? "border-primary bg-primary/20 text-primary" : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"}`}
                        >
                          {mode.replace("-", " ")}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">Name *</label>
                      <input
                        required
                        type="text"
                        className="w-full bg-card border border-border rounded-lg p-4 md:p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">WhatsApp Number *</label>
                      <input
                        required
                        type="tel"
                        className="w-full bg-card border border-border rounded-lg p-4 md:p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {orderMode !== "pickup" && (
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                        {orderMode === "dine-in" ? "Table Number *" : "Room Number *"}
                      </label>
                      <input
                        required
                        type="text"
                        placeholder={orderMode === "dine-in" ? "e.g. Table 4" : "e.g. Jibhi Room 2"}
                        className="w-full bg-card border border-border rounded-lg p-4 md:p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                        value={locationInfo}
                        onChange={(e) => setLocationInfo(e.target.value)}
                      />
                    </div>
                  )}
                </form>
              )}

              {step === "payment" && (
                <div className="space-y-6 pt-4 border-t border-border animate-in fade-in slide-in-from-right-4">
                  <div className="text-left">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground/80 mb-2">Secure Payment</h3>
                    <p className="text-xs text-muted-foreground">Pay using any UPI app</p>
                  </div>

                  <div className="flex flex-col space-y-4">
                    <div className="w-full grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => handleCopy("offthetrail@upi", "upi")} className="bg-card border border-border rounded-lg p-4 md:p-3 flex flex-col items-center gap-1 hover:bg-accent transition-colors">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">UPI ID</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif text-foreground">offthetrail@upi</span>
                          {copied === "upi" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      <button type="button" onClick={() => handleCopy(subtotal.toString(), "amount")} className="bg-card border border-border rounded-lg p-4 md:p-3 flex flex-col items-center gap-1 hover:bg-accent transition-colors">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Amount</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-serif text-foreground">Rs.{subtotal}</span>
                          {copied === "amount" ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                    </div>

                    <div className="space-y-2 pt-4">
                      <label className="text-[10px] uppercase tracking-widest text-muted-foreground">UTR / Reference No. *</label>
                      <input
                        type="text"
                        placeholder="e.g. 301234567890"
                        className="w-full bg-card border border-border rounded-lg p-4 md:p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                      />
                    </div>

                    <div className="flex flex-col items-center justify-center pt-6 pb-2">
                      <p className="text-xs text-muted-foreground mb-4">Or scan to pay</p>
                      <div className="bg-white p-3 rounded-xl inline-block">
                        <QrCode className="w-24 h-24 text-black opacity-80" />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-4">
                      <Lock className="w-3 h-3" />
                      <span>Order is verified manually after submission.</span>
                    </div>
                  </div>
                </div>
              )}

              {step === "submitted" && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-12 animate-in zoom-in-95">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-serif text-2xl text-foreground">Order Submitted</h3>
                    <p className="text-sm text-muted-foreground">Your order and payment are pending verification.</p>
                  </div>
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex gap-3 text-left w-full">
                    <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-primary/80">Please notify us via WhatsApp so the kitchen can begin preparation immediately.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border bg-background/95 backdrop-blur-xl pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
            {step === "details" && (
              <button
                type="submit"
                form="checkout-form"
                className="w-full bg-foreground text-background py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-95"
              >
                Proceed to Payment
              </button>
            )}
            {step === "payment" && (
              <button
                onClick={handleSubmitOrder}
                disabled={!utr || utr.length < 6}
                className="w-full bg-primary text-black py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100"
              >
                Confirm Order
              </button>
            )}
            {step === "submitted" && (
              <button
                onClick={handleWhatsAppFallback}
                className="w-full flex items-center justify-center gap-2 bg-foreground text-background py-4 rounded-xl font-bold uppercase tracking-widest text-xs transition-transform hover:scale-[1.02] active:scale-95"
              >
                <span>Notify via WhatsApp</span>
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
