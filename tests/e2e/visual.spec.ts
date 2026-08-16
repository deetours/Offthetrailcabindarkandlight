import { test } from "@playwright/test"

for (const [name, route] of [
  ["homepage", "/"],
  ["stays", "/stays"],
  ["stay-detail", "/stays/dalhousie"],
  ["booking", "/booking/stay/dalhousie?room=Standard%20Room"],
  ["payment", "/payment?type=stay&id=dalhousie&total=4500"],
  ["cafe", "/cafe"],
  ["trip", "/trips/spiti"],
] as const) {
  test(`@visual ${name} visual baseline`, async ({ page }) => {
    test.skip(!["chromium-desktop", "mobile-chrome"].includes(test.info().project.name), "baseline projects only")
    await page.emulateMedia({ reducedMotion: "reduce" })
    await page.goto(route)
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: test.info().outputPath(`${name}.png`), fullPage: true, animations: "disabled" })
  })
}
