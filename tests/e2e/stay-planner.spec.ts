import { test, expect } from "@playwright/test"

test.describe("Dalhousie Estate Direct Room Enquiry Flow (Phase 2)", () => {
  test("renders room catalogue with direct WhatsApp enquiry links for all categories", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // 1. Verify Room Collection is mounted with all 3 categories
    const roomCatalog = page.locator("#rooms")
    await expect(roomCatalog).toBeVisible()

    const expectedRooms = [
      { name: "Standard Room", rate: "₹3,200" },
      { name: "Deluxe Room", rate: "₹4,000" },
      { name: "Super Deluxe Room", rate: "₹4,800" },
    ]

    for (const room of expectedRooms) {
      const card = roomCatalog.locator("article").filter({
        has: page.getByRole("heading", { name: room.name, exact: true }),
      })
      await expect(card).toBeVisible()
      await expect(card.getByText(room.rate).first()).toBeVisible()

      // Primary Action is direct WhatsApp link
      const waLink = card.getByRole("link", { name: /enquire on whatsapp/i })
      await expect(waLink).toBeVisible()

      const href = await waLink.getAttribute("href")
      expect(href).not.toBeNull()
      expect(href).toContain("wa.me/919816315898")
      const decoded = decodeURIComponent(href!)
      expect(decoded).toContain(room.name)
      expect(decoded).toContain("Dalhousie Estate")
      expect(decoded).toContain("Source: OFF THE TRAIL website")
    }

    // 2. CRITICAL: Verify absence of obsolete date picker & booking flow wizard
    await expect(page.locator("#booking-flow")).toHaveCount(0)
    await expect(page.locator("#booking-checkin")).toHaveCount(0)
    await expect(page.locator("#booking-checkout")).toHaveCount(0)
    await expect(page.locator("#booking-fullname")).toHaveCount(0)
    await expect(page.locator("#booking-phone")).toHaveCount(0)
    await expect(page.locator("#booking-utr")).toHaveCount(0)
  })

  test("Harmonized page-wide CTAs (Hero, FAQ, and Mobile Sticky CTA) target rooms", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/stays/dalhousie", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // 1. Hero CTA points to #rooms
    const heroCta = page.getByRole("link", { name: /explore the rooms|explore rooms/i }).first()
    await expect(heroCta).toBeVisible()
    expect(await heroCta.getAttribute("href")).toBe("#rooms")

    // 2. FAQ secondary CTA is "Ask us on WhatsApp" pointing to business number
    const faqCta = page.getByRole("link", { name: /ask us on whatsapp/i })
    await expect(faqCta).toBeVisible()
    const faqHref = await faqCta.getAttribute("href")
    expect(faqHref).toContain("wa.me/919816315898")

    // 3. Mobile Sticky CTA: scroll past hero (scroll to Chapter II)
    await page.evaluate(() => {
      window.scrollTo(0, 1000)
      window.dispatchEvent(new Event("scroll"))
    })
    await page.waitForTimeout(600)

    // Shows "Starting from", starting rate ₹3,200/night, and "Explore the rooms" button
    const stickySection = page.locator("div.fixed.bottom-0")
    await expect(stickySection.getByText(/starting from/i)).toBeVisible()
    await expect(stickySection.getByText(/₹3,200\/night/i)).toBeVisible()
    const stickyBtn = stickySection.getByRole("button", { name: /explore the rooms|explore rooms/i })
    await expect(stickyBtn).toBeVisible()

    // Clicking scrolls to #rooms
    await stickyBtn.click()
    await page.waitForTimeout(400)
  })
})
