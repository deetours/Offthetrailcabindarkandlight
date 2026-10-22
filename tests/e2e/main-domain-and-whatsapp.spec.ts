import { test, expect } from "@playwright/test"
import { buildWaLink, DEFAULT_OFFTHETRAIL_WA_NUMBER, getOffTheTrailWaNumber } from "../../components/ui/whatsapp-popup"

test.describe("Main-Domain Landing Page and WhatsApp Configuration Verification", () => {
  test("WhatsApp helper functions use the single source of truth env var", () => {
    // Configured or fallback default number
    const number = getOffTheTrailWaNumber()
    expect(number).toBe("919816315898")
    expect(DEFAULT_OFFTHETRAIL_WA_NUMBER).toBe("919816315898")

    // buildWaLink formats correct WhatsApp URL and encodes message
    const sampleMsg = "Hello! Test message with spaces & special characters: ?=/#"
    const link = buildWaLink(sampleMsg)
    expect(link).toBe(`https://wa.me/919816315898?text=${encodeURIComponent(sampleMsg)}`)

    // buildWaLink respects explicit override if passed
    const customLink = buildWaLink("Hi", "919876543210")
    expect(customLink).toBe(`https://wa.me/919876543210?text=${encodeURIComponent("Hi")}`)
  })

  test("/stays/dalhousie renders complete Dalhousie Estate landing page with canonical metadata", async ({ page }) => {
    test.slow()
    await page.goto("/stays/dalhousie", { timeout: 60000 })

    // 1. Verify Page Title & Head Metadata
    await expect(page).toHaveTitle(/Off The Trail Dalhousie Estate/i)

    // Check canonical link tag
    const canonicalLink = page.locator("link[rel='canonical']")
    await expect(canonicalLink).toHaveAttribute("href", "https://offthetrail.in/stays/dalhousie")

    // Check OpenGraph URL
    const ogUrl = page.locator("meta[property='og:url']")
    await expect(ogUrl).toHaveAttribute("content", "https://offthetrail.in/stays/dalhousie")

    // 2. Verify Key Sections are present
    await expect(page.getByRole("heading", { name: "Dalhousie Estate" })).toBeVisible()
    await expect(page.getByText("Trade the noise for silence.")).toBeVisible()
    await expect(page.getByText("Ten rooms. A slower pace. A quieter side of the mountains.")).toBeVisible()

    // 3. Verify Room Catalogue
    const roomCatalog = page.locator("#rooms")
    await expect(roomCatalog).toBeVisible()
    await expect(roomCatalog.getByRole("heading", { name: "Super Deluxe Room", exact: true })).toBeVisible()
    await expect(roomCatalog.getByRole("heading", { name: "Deluxe Room", exact: true })).toBeVisible()
    await expect(roomCatalog.getByRole("heading", { name: "Standard Room", exact: true })).toBeVisible()

    // 4. Verify Concierge WhatsApp button uses 919816315898
    const conciergeBtn = page.getByRole("link", { name: "Concierge", exact: true })
    await expect(conciergeBtn).toBeVisible()
    const conciergeHref = await conciergeBtn.getAttribute("href")
    expect(conciergeHref).toContain("wa.me/919816315898")

    // Also verify FAQ WhatsApp button uses 919816315898
    const faqConciergeBtn = page.getByRole("link", { name: /ask concierge on whatsapp/i })
    await expect(faqConciergeBtn).toBeVisible()
    const faqHref = await faqConciergeBtn.getAttribute("href")
    expect(faqHref).toContain("wa.me/919816315898")

    // 5. Verify Booking Flow is mounted
    const bookingFlow = page.locator("#booking-flow")
    await expect(bookingFlow).toBeVisible()
  })

  test("/stays/dalhousie-estate also renders with canonical pointing to main-domain /stays/dalhousie", async ({ page }) => {
    test.slow()
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })

    // Check canonical link tag points to https://offthetrail.in/stays/dalhousie
    const canonicalLink = page.locator("link[rel='canonical']")
    await expect(canonicalLink).toHaveAttribute("href", "https://offthetrail.in/stays/dalhousie")

    await expect(page.getByRole("heading", { name: "Dalhousie Estate" })).toBeVisible()
  })

  test("Main homepage and existing routes continue to load cleanly", async ({ page }) => {
    test.slow()
    // Main homepage
    const homeRes = await page.goto("/", { timeout: 60000 })
    expect(homeRes?.status()).toBeLessThan(400)
    await expect(page.locator("body")).not.toBeEmpty()

    // Stays explorer
    const staysRes = await page.goto("/stays", { timeout: 60000 })
    expect(staysRes?.status()).toBeLessThan(400)
    await expect(page.locator("body")).not.toBeEmpty()

    // Cafe page
    const cafeRes = await page.goto("/cafe", { timeout: 60000 })
    expect(cafeRes?.status()).toBeLessThan(400)
    await expect(page.locator("body")).not.toBeEmpty()
  })
})
