import { test, expect } from "@playwright/test"
import { futureDate } from "../helpers/runtime"

test.describe("Dalhousie Estate Continuous Stay Planner (Batch 2)", () => {
  test("renders continuous stay planner with progressive disclosure and live WhatsApp handoff", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    const bookingSection = page.locator("#booking-flow")
    await expect(bookingSection).toBeVisible()

    // 1. Verify Editorial Header
    await expect(bookingSection.getByText("PLAN YOUR STAY")).toBeVisible()
    await expect(bookingSection.getByRole("heading", { name: "Your time in the mountains." })).toBeVisible()

    // 2. Initial state: Total is placeholder ₹— and CTA is disabled
    await expect(bookingSection.getByText("₹—")).toBeVisible()
    const disabledCta = bookingSection.getByRole("button", { name: /select dates to continue/i })
    await expect(disabledCta).toBeVisible()
    await expect(disabledCta).toBeDisabled()

    // 3. Select valid future dates
    const d1 = futureDate(10)
    const d2 = futureDate(12)
    const checkInInput = page.locator("#booking-checkin")
    const checkOutInput = page.locator("#booking-checkout")
    await checkInInput.fill(d1)
    await checkOutInput.fill(d2)

    // Duration badge appears (2 nights)
    await expect(bookingSection.getByText(/2 nights stay/i)).toBeVisible()

    // CTA now prompts for room
    const roomPromptCta = bookingSection.getByRole("button", { name: /select a room to continue/i })
    await expect(roomPromptCta).toBeVisible()
    await expect(roomPromptCta).toBeDisabled()

    // 4. Select room via Room Ledger quantity stepper (1x Deluxe Room @ ₹4,000/night)
    const deluxeIncreaseBtn = page.getByRole("button", { name: "Increase Deluxe Room quantity" })
    await deluxeIncreaseBtn.click()

    // 5. Total immediately calculates: 2 nights * ₹4,000 = ₹8,000
    await expect(bookingSection.getByText("₹8,000").first()).toBeVisible()
    await expect(bookingSection.getByText("1 room selected (max 2 guests)")).toBeVisible()

    // 6. Primary CTA becomes active "Continue on WhatsApp" link
    const whatsappCta = bookingSection.getByRole("link", { name: /continue on whatsapp/i })
    await expect(whatsappCta).toBeVisible()

    const href = await whatsappCta.getAttribute("href")
    expect(href).not.toBeNull()
    expect(href).toContain("wa.me/919816315898")
    expect(decodeURIComponent(href!)).toContain("Hi OFF THE TRAIL! I'm interested in staying at Dalhousie Estate.")
    expect(decodeURIComponent(href!)).toContain("• Deluxe Room × 1")
    expect(decodeURIComponent(href!)).toContain("Duration: 2 nights")
    expect(decodeURIComponent(href!)).toContain("Estimated stay total: ₹8,000 (incl. breakfast)")
    expect(decodeURIComponent(href!)).toContain("Source: OFF THE TRAIL website")

    // 7. Secondary quiet concierge link is present
    const secondaryLink = bookingSection.getByRole("link", { name: /have questions before choosing\? ask concierge on whatsapp/i })
    await expect(secondaryLink).toBeVisible()
    const secondaryHref = await secondaryLink.getAttribute("href")
    expect(secondaryHref).toContain("wa.me/919816315898")

    // 8. CRITICAL: Verify absence of obsolete procedural steps
    // Zero guest name/phone inputs
    await expect(page.locator("#booking-fullname")).toHaveCount(0)
    await expect(page.locator("#booking-phone")).toHaveCount(0)
    // Zero UPI QR or deep-link screens
    await expect(page.getByText("Scan using Google Pay, PhonePe, Paytm")).toHaveCount(0)
    // Zero UTR / transaction inputs
    await expect(page.locator("#booking-utr")).toHaveCount(0)
  })

  test("Room selection persists across page refresh via sessionStorage draft", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Fill dates and select Super Deluxe
    const d1 = futureDate(5)
    const d2 = futureDate(8)
    await page.locator("#booking-checkin").fill(d1)
    await page.locator("#booking-checkout").fill(d2)
    await page.getByRole("button", { name: "Increase Super Deluxe Room quantity" }).click()

    // Verify 3 nights * ₹4,800 = ₹14,400 in the primary CTA button
    const whatsappBtn = page.locator("#booking-flow").getByRole("link", { name: /continue on whatsapp · ₹14,400/i })
    await expect(whatsappBtn).toBeVisible()

    // Reload the page
    await page.reload()
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Verify draft restored
    await expect(page.locator("#booking-checkin")).toHaveValue(d1)
    await expect(page.locator("#booking-checkout")).toHaveValue(d2)
    await expect(whatsappBtn).toBeVisible()
  })

  test("Batch 3: Harmonized page-wide CTAs (Hero, Room Catalog, FAQ, and Mobile Sticky CTA)", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/stays/dalhousie", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // 1. Hero CTA is "Plan your stay"
    const heroCta = page.getByRole("link", { name: /plan your stay/i }).first()
    await expect(heroCta).toBeVisible()
    expect(await heroCta.getAttribute("href")).toBe("#booking-flow")

    // 2. Room Catalog CTA buttons are "Enquire about this room"
    const roomEnquireBtns = page.getByRole("button", { name: /enquire about/i })
    expect(await roomEnquireBtns.count()).toBeGreaterThanOrEqual(3)

    // 3. FAQ secondary CTA is "Ask us on WhatsApp"
    const faqCta = page.getByRole("link", { name: /ask us on whatsapp/i })
    await expect(faqCta).toBeVisible()
    const faqHref = await faqCta.getAttribute("href")
    expect(faqHref).toContain("wa.me/919816315898")

    // 4. Mobile Sticky CTA: scroll past hero (scroll to Room Catalog)
    await page.locator("#rooms").scrollIntoViewIfNeeded()
    await page.waitForTimeout(600) // allow scroll listener & framer motion animation

    // Initially unselected: shows "Starting from" and "Plan your stay"
    const stickySection = page.locator("div.fixed.bottom-0")
    await expect(stickySection.getByText(/starting from/i)).toBeVisible()
    await expect(stickySection.getByRole("button", { name: /plan your stay/i })).toBeVisible()

    // Now select dates and room in the stay planner
    const d1 = futureDate(12)
    const d2 = futureDate(14)
    await page.locator("#booking-checkin").fill(d1)
    await page.locator("#booking-checkout").fill(d2)
    await page.getByRole("button", { name: "Increase Deluxe Room quantity" }).click()

    // Scroll back to #rooms so #booking-flow is out of view and sticky bar reappears
    await page.locator("#rooms").scrollIntoViewIfNeeded()
    await page.waitForTimeout(600)

    // Contextual sticky CTA updates to live estimate and "Continue on WhatsApp"
    await expect(stickySection.getByText(/estimated stay/i)).toBeVisible()
    await expect(stickySection.getByText("₹8,000")).toBeVisible()
    const stickyWhatsAppLink = stickySection.getByRole("link", { name: /continue on whatsapp/i })
    await expect(stickyWhatsAppLink).toBeVisible()
    const stickyHref = await stickyWhatsAppLink.getAttribute("href")
    expect(stickyHref).toContain("wa.me/919816315898")
    expect(decodeURIComponent(stickyHref!)).toContain("Deluxe Room")
  })
})
