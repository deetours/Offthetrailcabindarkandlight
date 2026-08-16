import { test } from "@playwright/test"
import { expectNoHorizontalOverflow } from "../helpers/runtime"

const viewports = [
  { width: 320, height: 568 },
  { width: 360, height: 800 },
  { width: 390, height: 844 },
  { width: 430, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1920, height: 1080 },
]

for (const viewport of viewports) {
  test(`@responsive critical pages do not overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    for (const route of ["/", "/stays", "/booking/stay/dalhousie?room=Standard%20Room", "/cafe"]) {
      await page.goto(route)
      await expectNoHorizontalOverflow(page)
    }
  })
}
