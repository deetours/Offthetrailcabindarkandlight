import { expect, test } from "@playwright/test"

test("@critical cafe supports inline cart updates and a pending-verification order", async ({ page }) => {
  await page.goto("/cafe")

  const item = page.getByText("Orange Juice", { exact: true }).locator("..", { has: page.getByRole("button", { name: /add/i }) })
  await item.getByRole("button", { name: /add/i }).click()
  await expect(page.getByRole("button", { name: /view order/i })).toBeVisible()
  await page.getByRole("button", { name: /view order/i }).click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await expect(page.getByText("Rs.150", { exact: true }).first()).toBeVisible()
  await page.getByRole("button", { name: /proceed to checkout/i }).click()

  await page.getByLabel("Name *").fill("E2E Traveller")
  await page.getByLabel("WhatsApp Number *").fill("9816315898")
  await page.getByLabel("Table Number *").fill("Table E2E")
  await page.getByRole("button", { name: /proceed to payment/i }).click()

  await page.getByLabel("UTR / Reference No. *").fill("E2E123456")
  await page.getByRole("button", { name: /confirm order/i }).click()
  await expect(page.getByRole("heading", { name: /payment submitted/i })).toBeVisible()
  await expect(page.getByText(/pending verification/i)).toBeVisible()
})

test("@critical cafe does not open a blocking dialog after Add", async ({ page }) => {
  await page.goto("/cafe")
  await page.getByText("Orange Juice", { exact: true }).locator("..").getByRole("button", { name: /add/i }).click()
  await expect(page.getByRole("dialog")).toBeHidden()
})
