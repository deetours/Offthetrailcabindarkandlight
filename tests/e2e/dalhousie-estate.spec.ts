import { test, expect } from "@playwright/test"
import { expectNoHorizontalOverflow } from "../helpers/runtime"

const viewports = [
  { name: "375", width: 375, height: 812 },
  { name: "390", width: 390, height: 844 },
  { name: "768", width: 768, height: 1024 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1600", width: 1600, height: 1000 },
]

test.describe("Dalhousie Estate Apple-level precision and consistency", () => {
  for (const vp of viewports) {
    test(`renders flawlessly at ${vp.width}px (${vp.name}) without overflow or 404s`, async ({ page }) => {
      test.slow()
      const failed404s: string[] = []
      page.on("response", (res) => {
        if (res.status() === 404) {
          failed404s.push(res.url())
        }
      })

      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
      await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

      // 1. Verify zero 404 network errors
      expect(failed404s, `Found 404 requests at ${vp.width}px: ${failed404s.join(", ")}`).toEqual([])

      // 2. Verify no horizontal overflow
      await expectNoHorizontalOverflow(page)

      // 3. Verify Hero copy and elements
      await expect(page.getByText("DALHOUSIE · HIMACHAL PRADESH")).toBeVisible()
      await expect(page.getByRole("heading", { name: "Dalhousie Estate" })).toBeVisible()
      await expect(page.getByText("Trade the noise for silence.")).toBeVisible()
      await expect(page.getByText("Ten rooms. A slower pace. A quieter side of the mountains.")).toBeVisible()
      await expect(page.getByText("From ₹3,200/night").first()).toBeVisible()

      // 4. Verify Chapter III Room Collection has all three categories with exact titles
      const roomCatalog = page.locator("#rooms")
      await expect(roomCatalog).toBeVisible()
      await expect(roomCatalog.getByRole("heading", { name: "Super Deluxe Room", exact: true })).toBeVisible()
      await expect(roomCatalog.getByRole("heading", { name: "Deluxe Room", exact: true })).toBeVisible()
      await expect(roomCatalog.getByRole("heading", { name: "Standard Room", exact: true })).toBeVisible()

      // 5. Verify room enquiry WhatsApp links are present on cards
      const standardCard = roomCatalog.locator("article").filter({ hasText: "Standard Room" })
      await expect(standardCard.getByRole("link", { name: /enquire on whatsapp/i })).toBeVisible()

      // 6. Verify absence of obsolete booking flow engine
      await expect(page.locator("#booking-flow")).toHaveCount(0)

      // 7. Scroll through page to allow next/image lazy loading to decode, then scroll back to top
      await page.evaluate(async () => {
        const distance = 600
        const delay = 60
        while (document.scrollingElement && document.scrollingElement.scrollTop + window.innerHeight < document.scrollingElement.scrollHeight) {
          document.scrollingElement.scrollBy(0, distance)
          await new Promise((resolve) => setTimeout(resolve, delay))
        }
        window.scrollTo(0, 0)
        await new Promise((resolve) => setTimeout(resolve, 300))
      })

      // Capture full-page post-implementation screenshot
      await page.screenshot({
        path: `test-artifacts/verified-${vp.name}.png`,
        fullPage: true,
        timeout: 30000,
      })
    })
  }

  test("Room Catalog provides direct room-specific WhatsApp enquiry links for all 3 categories", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    const rooms = [
      { name: "Standard Room", rate: "₹3,200" },
      { name: "Deluxe Room", rate: "₹4,000" },
      { name: "Super Deluxe Room", rate: "₹4,800" },
    ]

    for (const room of rooms) {
      const card = page.locator("#rooms article").filter({
        has: page.getByRole("heading", { name: room.name, exact: true }),
      })
      await expect(card).toBeVisible()
      await expect(card.getByText(room.rate).first()).toBeVisible()

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
  })

  test("Mobile sticky CTA appears past hero and dismisses before footer", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Scroll past hero
    await page.evaluate(() => {
      window.scrollTo(0, 1200)
      window.dispatchEvent(new Event("scroll"))
    })
    await page.waitForTimeout(500)

    const stickyCta = page.getByRole("button", { name: /explore the rooms|explore rooms/i })
    await expect(stickyCta).toBeVisible()

    // Scroll into the footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
      window.dispatchEvent(new Event("scroll"))
    })
    await page.waitForTimeout(500)

    // Verify sticky CTA dismisses before footer
    await expect(stickyCta).not.toBeVisible()
  })

  test("Direct reservations trust cues and host profile are displayed without obsolete checkout form", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // 1. Verify TrustBar displays verified estate differentiators
    await expect(page.getByText("10 Secluded Rooms").first()).toBeVisible()
    await expect(page.getByText("Drive-In & Parking").first()).toBeVisible()
    await expect(page.getByText("Breakfast Included", { exact: true }).first()).toBeVisible()
    await expect(page.getByText("Owner Verified").first()).toBeVisible()

    // 2. Verify complete absence of checkout wizard elements
    await expect(page.locator("#booking-flow")).toHaveCount(0)
    await expect(page.locator("#booking-checkin")).toHaveCount(0)
    await expect(page.locator("#booking-checkout")).toHaveCount(0)
    await expect(page.locator("#booking-fullname")).toHaveCount(0)
    await expect(page.locator("#booking-phone")).toHaveCount(0)
    await expect(page.locator("#booking-utr")).toHaveCount(0)
  })
})
