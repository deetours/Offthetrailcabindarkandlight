import { expect, test } from "@playwright/test"

test("@critical desktop navigation reaches every primary destination", async ({ page }) => {
  test.skip((page.viewportSize()?.width || 0) < 768, "desktop-only behavior")
  await page.goto("/cafe")
  await page.evaluate(() => window.scrollTo(0, 300))
  const navigation = page.getByRole("navigation").first()

  for (const [name, path] of [
    ["Stays", "/stays"],
    ["Activities", "/activities"],
    ["Trips", "/trips"],
    ["Café", "/cafe"],
  ] as const) {
    await navigation.getByRole("link", { name }).click()
    await expect(page).toHaveURL(new RegExp(`${path.replace("/", "\\/")}$`))
    await page.goto("/cafe")
    await page.evaluate(() => window.scrollTo(0, 300))
  }
})

test("@critical @responsive mobile menu opens, navigates, and closes", async ({ page }) => {
  test.skip((page.viewportSize()?.width || 1000) >= 768, "mobile-only behavior")
  await page.goto("/cafe")
  await page.evaluate(() => window.scrollTo(0, 300))

  const toggle = page.getByRole("button", { name: "Toggle menu" })
  await toggle.click()
  await expect(page.getByRole("navigation").last()).toBeVisible()
  await page.getByRole("navigation").last().getByRole("link", { name: "Stays" }).click()
  await expect(page).toHaveURL(/\/stays$/)
  await expect(page.getByRole("navigation").last()).toBeHidden()
})

test("@smoke footer links do not lead to missing routes", async ({ page }) => {
  await page.goto("/stays/dalhousie")
  const footer = page.getByRole("contentinfo")
  for (const link of await footer.getByRole("link").all()) {
    const href = await link.getAttribute("href")
    if (!href?.startsWith("/")) continue
    const response = await page.request.get(href, { maxRedirects: 5 })
    expect(response.status(), `footer link ${href} is broken`).toBeLessThan(400)
  }
})
