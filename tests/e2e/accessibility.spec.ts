import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { criticalRoutes } from "../helpers/routes"

type AxePage = ConstructorParameters<typeof AxeBuilder>[0]["page"]

for (const route of criticalRoutes) {
  test(`@a11y ${route} has no serious or critical axe violations`, async ({ page }, testInfo) => {
    await page.goto(route)
    await page.waitForLoadState("domcontentloaded")
    const results = await new AxeBuilder({ page: page as unknown as AxePage })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .analyze()
    const blocking = results.violations.filter((violation: { impact?: string | null }) =>
      violation.impact === "critical" || violation.impact === "serious",
    )
    await testInfo.attach("axe-results", {
      body: JSON.stringify(results.violations, null, 2),
      contentType: "application/json",
    })
    expect(blocking).toEqual([])
  })
}
