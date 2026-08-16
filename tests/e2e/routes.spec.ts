import { expect, test } from "@playwright/test"
import { publicRoutes, protectedRoutes } from "../helpers/routes"
import { monitorRuntime } from "../helpers/runtime"

for (const route of publicRoutes) {
  test(`@smoke ${route} renders without a server or runtime failure`, async ({ page }, testInfo) => {
    const assertRuntime = monitorRuntime(page, testInfo)
    const response = await page.goto(route, { waitUntil: "domcontentloaded" })

    expect(response, `missing navigation response for ${route}`).not.toBeNull()
    expect(response!.status(), `${route} returned ${response!.status()}`).toBeLessThan(400)
    await expect(page.locator("body")).not.toBeEmpty()
    await expect(page.locator("h1").first()).toBeVisible()
    await assertRuntime()
  })
}

for (const route of protectedRoutes) {
  test(`@smoke unauthenticated access to ${route} redirects to login`, async ({ page }) => {
    await page.goto(route)
    await expect(page).toHaveURL(/\/login(?:\?|$)/)
  })
}

test("@smoke unknown routes use the branded not-found page", async ({ page }) => {
  const response = await page.goto("/e2e-route-that-does-not-exist")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading")).toBeVisible()
})
