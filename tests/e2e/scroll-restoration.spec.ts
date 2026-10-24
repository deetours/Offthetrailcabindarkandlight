import { test, expect } from "@playwright/test"

const viewports = [
  { name: "mobile-390", width: 390, height: 844 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "desktop-1440", width: 1440, height: 900 },
]

test.describe("Scroll Restoration and Scroll Cue Verification", () => {
  for (const vp of viewports) {
    test(`Dalhousie Estate scrolling & scroll cue at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      const consoleErrors: string[] = []
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text())
      })

      await page.goto("/stays/dalhousie", { waitUntil: "networkidle", timeout: 60000 })

      // 1. Verify document-level vertical overflow is not blocked
      const docMetrics = await page.evaluate(() => {
        const html = window.getComputedStyle(document.documentElement)
        const body = window.getComputedStyle(document.body)
        const main = document.querySelector("main") ? window.getComputedStyle(document.querySelector("main")!) : null
        return {
          htmlOverflowY: html.overflowY,
          bodyOverflowY: body.overflowY,
          mainOverflowY: main ? main.overflowY : null,
          scrollHeight: document.documentElement.scrollHeight,
          clientHeight: document.documentElement.clientHeight,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        }
      })

      // Main overflow-y must not be hidden
      expect(["visible", "auto"]).toContain(docMetrics.mainOverflowY)
      // Document must have large scrollable height well exceeding viewport
      expect(docMetrics.scrollHeight).toBeGreaterThan(docMetrics.clientHeight * 2)
      // No horizontal overflow
      expect(docMetrics.scrollWidth).toBeLessThanOrEqual(docMetrics.clientWidth + 1)

      // 2. Verify "SCROLL TO DISCOVER" indicator is visible
      const scrollCue = page.locator("a", { hasText: /SCROLL TO DISCOVER/i })
      await expect(scrollCue).toBeVisible()
      await expect(scrollCue).toHaveAttribute("href", "#overview")
      await expect(scrollCue).toHaveAttribute("aria-label", "Scroll to discover next section")

      // 3. Test natural mouse-wheel scrolling
      await page.mouse.wheel(0, 600)
      await page.waitForTimeout(400)
      const afterWheelY = await page.evaluate(() => window.scrollY)
      expect(afterWheelY).toBeGreaterThan(100)

      // 4. Test keyboard scrolling (PageDown, ArrowDown)
      await page.keyboard.press("PageDown")
      await page.waitForTimeout(400)
      const afterPageDownY = await page.evaluate(() => window.scrollY)
      expect(afterPageDownY).toBeGreaterThan(afterWheelY)

      // 5. Test clicking "SCROLL TO DISCOVER" navigates to #overview
      await page.evaluate(() => window.scrollTo(0, 0))
      await page.waitForTimeout(300)
      await scrollCue.click()
      await page.waitForTimeout(600)

      const overviewSection = page.locator("#overview")
      await expect(overviewSection).toBeInViewport()
      const scrollPosAfterClick = await page.evaluate(() => window.scrollY)
      expect(scrollPosAfterClick).toBeGreaterThan(200)

      // 6. Test scrolling reaches the bottom / footer
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
      await page.waitForTimeout(500)
      const footer = page.locator("footer")
      await expect(footer).toBeVisible()

      // 7. Verify zero console errors
      expect(consoleErrors.filter(e => !e.includes("favicon") && !e.includes("analytics"))).toEqual([])
    })

    test(`Jibhi page scrolling & scroll cue at ${vp.name} (${vp.width}x${vp.height})`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height })

      await page.goto("/jibhi", { waitUntil: "networkidle", timeout: 60000 })

      // Verify scroll cue points to #canopy
      const scrollCue = page.locator("a", { hasText: /SCROLL TO DISCOVER/i })
      await expect(scrollCue).toBeVisible()
      await expect(scrollCue).toHaveAttribute("href", "#canopy")

      // Test click scrolls to #canopy section
      await scrollCue.click()
      await page.waitForTimeout(600)
      const canopySection = page.locator("#canopy")
      await expect(canopySection).toBeInViewport()
    })
  }
})
