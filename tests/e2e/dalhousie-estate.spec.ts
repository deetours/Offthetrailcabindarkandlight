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
      const failed404s: string[] = []
      page.on("response", (res) => {
        if (res.status() === 404) {
          failed404s.push(res.url())
        }
      })

      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto("/stays/dalhousie-estate", { waitUntil: "domcontentloaded" })
      await page.waitForSelector("#booking-flow", { state: "attached" })

      // 1. Verify zero 404 network errors (e.g., no phantom /noise.png)
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

      // 5. Verify Chapter IV Booking Flow is present
      const bookingFlow = page.locator("#booking-flow")
      await expect(bookingFlow).toBeVisible()

      // 6. Scroll through page to allow next/image lazy loading to decode, then scroll back to top
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
      })
    })
  }

  test("Room Catalog 'Select this room' carries room selection to booking ledger", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#rooms", { state: "attached" })

    // Target the specific article containing the exact heading "Deluxe Room"
    const deluxeCard = page.locator("#rooms article").filter({
      has: page.getByRole("heading", { name: "Deluxe Room", exact: true }),
    })
    await expect(deluxeCard).toBeVisible()

    const selectButton = deluxeCard.getByRole("button", { name: /select this room/i })
    await selectButton.click()

    // Verify it smoothly navigated to booking-flow
    const bookingSection = page.locator("#booking-flow")
    await expect(bookingSection).toBeVisible()

    // The Deluxe Room in the room ledger should be present
    const deluxeRow = page.locator("#booking-flow").getByRole("heading", { name: "Deluxe Room", exact: true })
    await expect(deluxeRow).toBeVisible()
  })

  test("Mobile sticky CTA appears past hero and dismisses before footer", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/stays/dalhousie-estate", { waitUntil: "domcontentloaded" })
    await page.waitForSelector("#booking-flow", { state: "attached" })

    // Scroll to Chapter II (past hero, before booking flow)
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.waitForTimeout(500)

    const stickyCta = page.getByRole("button", { name: /check availability/i })
    await expect(stickyCta).toBeVisible()

    // Scroll all the way into the footer
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(500)

    // Verify sticky CTA dismisses before footer
    await expect(stickyCta).not.toBeVisible()
  })
})
