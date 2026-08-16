import { expect, test } from "@playwright/test"

test("@smoke principal routes provide useful metadata", async ({ page }) => {
  for (const route of ["/", "/stays", "/cafe", "/trips"]) {
    await page.goto(route)
    await expect(page).toHaveTitle(/Off.*Trail|Offthetrail/i)
    const description = await page.locator('meta[name="description"]').getAttribute("content")
    expect(description?.trim().length, `${route} needs a meta description`).toBeGreaterThan(20)
  }
})

test("@critical server-only secrets are not exposed to the browser", async ({ page }) => {
  await page.goto("/")
  const html = await page.content()
  for (const secretName of ["SUPABASE_SERVICE_ROLE_KEY", "RAZORPAY_KEY_SECRET", "INTERNAL_API_SECRET"]) {
    expect(html).not.toContain(secretName)
  }
})

test("@critical protected APIs reject unauthenticated mutation", async ({ request }) => {
  for (const endpoint of [
    "/api/bookings/hold",
    "/api/bookings/cancel",
    "/api/payments/create-order",
    "/api/payments/verify",
  ]) {
    const response = await request.post(endpoint, { data: {} })
    expect([401, 403], `${endpoint} returned ${response.status()}`).toContain(response.status())
  }
})
