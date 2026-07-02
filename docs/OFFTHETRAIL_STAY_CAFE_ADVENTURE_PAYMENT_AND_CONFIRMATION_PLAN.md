# OffTheTrail Stay, Café & Adventure Payment and Confirmation Plan

## 1. Executive Summary
This document provides a comprehensive audit, UX blueprint, and technical roadmap for implementing secure, premium, and unified booking, ordering, and payment flows across Stays, Café, and Adventures. The primary goal is to shift from direct WhatsApp inquiries to structured frontend flows with explicit UPI QR payment steps, followed by rigorous backend payment verification, while retaining the brand's surreal, dark-themed, and cinematic aesthetic.

## 2. Current-flow audit

### Stay Booking Flow
- **Current Stay selector:** Found in `components/stays/explore-stays-dynamic.tsx` and `components/stays/explore-stays.tsx`. *(Verified)*
- **Current booking modal/route:** Handled via `components/booking/stay-booking-flow.tsx`. *(Verified)*
- **Current booking page:** 3-step process (Configuration, Identity, Finalize). *(Verified)*
- **Current price summary:** Calculated client-side. Multiplies nightly rate by nights and guests. *(Verified)*
- **Current WhatsApp integration:** Redirects immediately upon clicking "Connect via WhatsApp" using hardcoded number `917629877144`. *(Verified)*

### Payment Flow
- **Current payment page:** `components/payment/payment-page.tsx`. *(Verified)*
- **Current UPI scanner image:** Missing. The UI asked for a UPI ID manually. *(Verified)*
- **Current confirmation page:** Redirects to `/confirmed` via a simulated 2000ms delay. *(Verified)*
- **Current validation:** Minimal frontend validation. *(Verified)*

### Café Flow
- **Current Café modal or page:** `components/cafe/cafe-cart-drawer.tsx`. *(Verified)*
- **Current Café order flow:** Collects Name, WhatsApp Number, Table/Room, and immediately redirects to WhatsApp (`917629877144`). *(Verified)*

### Data & Backend
- **Current Supabase integration:** API route `/api/leads` logs basic lead info. *(Verified)*
- **Current booking data model:** Basic lead schema. Lacks comprehensive booking/payment states. *(Verified)*

## 3. Stay booking flow
**Flow A — Stays**
1. **Select Location:** Dalhousie or Jibhi.
2. **Select Dates:** Check-in / Check-out with past-date prevention.
3. **Select Guests:** Adults, Children, and Rooms.
4. **Select Room:** 
   * Dalhousie: 4 Super Deluxe (w/ balcony), 2 Deluxe (w/ balcony), 4 Standard (w/ windows).
   * Jibhi: 2 Duplex Cottage (₹4,500/night incl. taxes), 1 Single Room (₹2,200/night).
5. **Review Stay:** Nightly rate, subtotal, taxes, total, cancellation note. 
6. **Guest Details:** Full name, phone, email, special requests. 
7. **Booking Summary:** Final review with edit capabilities. 
8. **Payment Page:** Dedicated page with UPI QR scanner image.
9. **Payment Review:** Supports detailed payment states (e.g., Payment pending verification).
10. **WhatsApp Confirmation:** Formatted payload acknowledging payment is under verification (not confirmed until backend verifies).

## 4. Stay payment page
The dedicated payment page will maintain the cinematic aesthetic while projecting security.
* **Content:** OffTheTrail branding, Booking reference, Guest name, Stay summary, Amount payable.
* **Payment Module:** UPI QR image, UPI ID, Payee name, strict payment instructions, Payment reference (UTR) field, and optional screenshot upload (pending backend support).
* **CTAs:** WhatsApp confirmation action, Return-to-booking CTA.
* **Security Messaging:** Explains that scanning the QR opens the user's UPI app, payment happens externally, and booking is *not confirmed* until both payment and room availability are explicitly verified.

## 5. UPI QR UX
The current UPI scanner image is missing and must be introduced.
* **Mobile UX:** Since users cannot scan a QR code displayed on their own mobile screen, the UI will prioritize a "Copy UPI ID" button, an "Open UPI App" intent link (if verified), and a "Copy Amount" button. The QR will act as a fallback for users booking on desktop but paying via mobile.
* **Validation:** The QR must not be blurry, must not be replaced by a placeholder, and the payee name and UPI ID must be explicitly written out below it. 

## 6. Payment verification model
The frontend must *never* treat payment as verified based on user actions alone.
* **Initial State post-submission:** `Payment Submitted — Pending Verification`.
* **Required Data:** Booking ID, Guest phone/email, Amount due, Amount paid, UPI ID, Payee name, Transaction reference (UTR), Screenshot URL, Payment timestamp, Verification status.
* **Verification Process:** Relies on manual admin review, UPI reconciliation, or bank statement matching via the backend.

## 7. Stay confirmation states
Customer-facing states to be implemented:
* Draft
* Booking details complete
* Payment pending
* Payment submitted
* Payment under verification
* Payment verified
* Booking pending room confirmation
* Booking confirmed
* Booking rejected
* Payment failed
* Payment refunded
* Booking cancelled

## 8. WhatsApp confirmation flow
The generated WhatsApp message for Stays will include:
* Booking reference, Guest name, Phone, Location, Room type, Check-in/out, Guests, Amount, Payment reference, Special requests.
* **Critical Rule:** The message must clearly state `"Payment submitted for verification."` It must *never* state `"Booking confirmed"` unless explicitly verified by the backend.

## 9. Café ordering flow
**Flow B — Café**
Occurs entirely inside a right-side drawer (desktop) or full-screen sheet (mobile).
1. Browse menu, choose items, variants, add-ons, quantities, and notes.
2. Review cart.
3. Choose order mode (e.g., Room service, Dine-in, Pickup).
4. Enter customer details.
5. Pay using the UPI QR scanner directly *inside* the modal.
6. Enter payment reference.
7. Submit the order to the café team for backend routing.

## 10. Café modal
* **Desktop:** Large right-side drawer.
* **Mobile:** Full-screen sheet.
* **Contents:** Order summary, editable items, order mode, table/room number, customer details, subtotal, taxes, grand total.
* **Constraints:** Users cannot submit an empty cart or bypass required table/room details. Confirmed status is hidden until the café accepts the order.

## 11. Café payment UX
The payment step is revealed *only after* the cart is valid and details are entered.
* **Contents:** Exact order total, Order reference, UPI QR, UPI ID, Payee name, Payment reference input, "I Have Paid" action, WhatsApp fallback.
* **State:** Upon submission, transitions to `Order Submitted — Payment Pending Verification` or `Order Submitted — Awaiting Café Acceptance`.

## 12. Café order routing
* **Primary Channel:** Backend order record populating a café/kitchen dashboard.
* **Secondary/Fallback Channel:** WhatsApp notification to the café team.
* **Order Payload:** Order ID, Customer name, Phone, Order mode, Table/Room, Items, Variants, Subtotal, Payment reference, Created time.

## 13. Café order statuses
* **Customer-facing:** Cart, Checkout, Payment pending, Payment submitted, Order submitted, Preparing, Ready, Served, Cancelled, Refund pending.
* **Café-facing:** Payment under verification, Order accepted, Completed, Rejected, Refunded.

## 14. Adventure WhatsApp flow
**Flow C — Adventure**
Remains strictly enquiry-based.
* **Collects:** Experience, Destination, Preferred/Flexible dates, Number of travellers, Name, Phone, Notes.
* **CTA:** "Confirm on WhatsApp" or "Plan My Adventure."
* **Rule:** No payment requested, no fake availability, no "Book Now" buttons.

## 15. Unified UX principles
While sharing the dark, cinematic, gold-accented theme, the task structures differ:
* **Stay:** Structured, multi-step booking.
* **Café:** Fast, immediate cart and payment modal.
* **Adventure:** Guided, exploratory enquiry.

## 16. Homepage entry points
* **Find a Stay:** Opens Stay selector.
* **Order from Café:** Opens Café ordering modal.
* **Explore Adventure:** Opens Adventure enquiry.
* Preserves selected values across transitions so users never re-enter the same information.

## 17. State-preservation plan
* Use React Context or global state managers (Zustand) for non-sensitive session data (Selected stay, dates, cart items, adventure selection).
* **Rule:** Do not store sensitive payment data, UTRs, or PII insecurely in `localStorage`. Transition to secure backend session storage once available.

## 18. Error states
* **Stay:** No availability, Invalid dates, Price changed, Payment reference missing, Payment failed, Booking expired.
* **Café:** Item sold out, Cart empty, Order mode missing, Café closed.
* **Adventure:** Experience/Date unavailable, Invalid phone.
* **Behavior:** Every error will have a clear message, primary action (e.g., "Try Again"), and preserve current form state.

## 19. Loading states
* Uses clear, contextual language (e.g., "Verifying availability...", "Generating payment secure link...") rather than indefinite, contextless spinners.

## 20. Mobile UX
* **Stay flow:** Clear steps, sticky CTAs, full-width controls.
* **Stay Payment:** Emphasizes "Copy UPI ID" and "Open UPI App" over scanning the QR code, which is impractical on a single device.
* **Café modal:** Full-screen bottom sheet, sticky payment CTA to avoid excessive scrolling.

## 21. Accessibility
* Ensure keyboard navigation, modal focus traps, Escape-key closing, legible date pickers, accessible cart announcements, clear QR alt text, and feedback for "Copy UPI ID" actions.
* Respect `prefers-reduced-motion` for page transitions.

## 22. Trust and safety language
* Use precise language: *"Payment is submitted for verification."*, *"Your booking is not confirmed until payment and room availability are verified."*, *"Keep your UPI transaction reference."*, *"Do not pay twice."*
* Strip out any misleading fake secure-payment badges or fake bank-verification statuses.

## 23. Backend data model
Required entities to be modeled in Supabase:
* **Stay:** Booking, Guest, Stay, Room type, Unit, Availability, Rate, Payment, Booking status.
* **Café:** Menu category, Menu item, Cart, Order, Order item, Kitchen status, Fulfilment mode.
* **Adventure:** Adventure, Enquiry, Traveller count.

## 24. Admin requirements
* **Stay Admin:** Manage bookings, verify payments manually by matching UTRs, confirm rooms, handle refunds.
* **Café Admin:** Accept/reject orders, verify payments, manage kitchen preparation status (Preparing, Ready, Served), toggle sold-out items.
* **Adventure Admin:** Manage enquiries, WhatsApp follow-ups.

## 25. Security and privacy
* Do not expose private Supabase keys or internal admin endpoints.
* Do not expose bank account details beyond approved UPI identifiers.
* Never trust client-side payment status; all final confirmations must stem from backend row-level security and admin states.

## 26. Analytics
* **Stay:** Stay selected, Dates selected, Payment page viewed, UPI copied, Payment reference submitted, Booking confirmed.
* **Café:** Item added, Checkout started, Order mode selected, Order submitted.
* **Adventure:** Adventure viewed, Enquiry started, WhatsApp opened.

## 27. Visual design
* Preserve the exact dark background `#0b0e11`, warm gold accents, existing glass/grain effects, shadows, and motion language.
* The design must feel Premium, Clear, Surreal, Trustworthy, Fast, and Mobile-friendly without resorting to generic checkout UI patterns or hiding practical information behind visual drama.

## 28. Risk register
1. **Mobile UPI QR Friction:** Users on mobile cannot scan a QR on the same screen. *Mitigation: Prioritize UPI Intent links and Copy UPI ID.*
2. **False Confirmations:** Users assuming a screenshot equals a booking. *Mitigation: Explicit "Pending Verification" copy.*
3. **Double Payments:** Network drops during checkout. *Mitigation: Clear "Do not pay twice" messaging and state recovery.*

## 29. Phased roadmap
* **Phase 0:** Audit and decisions (Current phase).
* **Phase 1:** Frontend flow design (Stay selector, booking flow, payment page, Café cart/modal, Adventure enquiry).
* **Phase 2:** Backend contracts (API definitions for bookings, orders, payments).
* **Phase 3:** Stay backend (Availability, creation, payment tracking).
* **Phase 4:** Café backend (Cart submission, order creation, dashboard).
* **Phase 5:** WhatsApp workflows.
* **Phase 6:** Admin tools.
* **Phase 7:** Testing (Safety, duplicates, accessibility).
* **Phase 8:** Launch safeguards.

## 30. Open decisions
| Decision | Status/Recommendation Required |
| :--- | :--- |
| Verified UPI QR image | Needs to be provided by the owner. |
| Verified UPI ID & Payee Name | Needs to be provided by the owner. |
| Verified WhatsApp number | Confirm if `917629877144` is the final production number. |
| Stay payment structure | Full upfront vs. Deposit? |
| Café payment structure | Full upfront via UPI vs. Pay-at-café? |
| Café order modes | Dine-in, Room service, Pickup support? |
| Payment proof upload | Is screenshot upload mandatory or optional? |
| Payment reference | Should UTR input be strictly mandatory? |
| Verification SLA | How quickly does admin verify payments? |
| Overbooking conflict | Protocol if payment succeeds but room becomes unavailable. |
| Refund/Cancellation policy | Needs documented standard operating procedure. |

## 31. Acceptance criteria
* The frontend visually matches the brand guidelines exactly.
* No flow claims "Confirmed" without backend validation.
* Mobile users can seamlessly copy the UPI ID or use an intent link.
* Café orders are strictly validated before exposing the payment QR.

## 32. Final recommendation
* **The Stay booking pattern:** Maintain the 3-step configuration but append a distinct, secure Step 4 for Payment processing.
* **The Stay payment-page pattern:** Dedicated, uncluttered page focusing heavily on trust, precise UTR collection, and clear "Pending Verification" messaging.
* **The UPI verification pattern:** Admin-verified UTR matching against bank statements as the source of truth.
* **The Stay WhatsApp message:** Formatted strictly as a notification of a *submitted* request, not a confirmed reservation.
* **The Café modal pattern:** Full-screen mobile sheet containing the entire cart, checkout, and payment cycle in one view to prevent cart abandonment.
* **The Café payment pattern:** In-modal QR display explicitly triggered only after cart validation and mode selection.
* **The Café backend-routing pattern:** Primary Supabase order table creation with an immediate WhatsApp notification fallback to the café manager.
* **The Adventure WhatsApp pattern:** Pure lead-generation enquiry without payment components.
* **The mobile pattern:** Sticky CTAs, touch-friendly inputs, and explicit "Copy UPI ID" buttons prioritizing single-device payment flows.
* **The first implementation phase:** Begin with Phase 1 (Frontend flow design) utilizing mocked backend states to finalize the UX before executing Phase 3 (Stay Backend).

“No code, payment integration, booking logic, Café order logic, WhatsApp configuration, route, database, backend service, UPI configuration, or project file was changed. This output is a complete audit, UX plan, and implementation blueprint only.”
