import { expect, test } from "@playwright/test"
import { futureDate } from "../helpers/runtime"

test("@critical stay booking validates dates, preserves details, and reaches pending payment", async ({ page }) => {
  await page.goto("/booking/stay/dalhousie?room=Standard%20Room")

  const checkIn = page.getByLabel("Check In")
  const checkOut = page.getByLabel("Check Out")
  await expect(checkIn).toHaveAttribute("min", futureDate(0))
  await checkIn.fill(futureDate(30))
  await checkOut.fill(futureDate(32))
  await page.getByRole("button", { name: /continue journey/i }).click()
  await page.getByRole("button", { name: /continue journey/i }).click()

  await page.getByLabel("First Name").fill("E2E")
  await page.getByLabel("Last Name").fill("Traveller")
  await page.getByLabel("Email").fill("e2e-traveller@example.test")
  await page.getByLabel("Phone").fill("9816315898")
  await page.getByRole("button", { name: /continue journey/i }).click()

  await expect(page.getByText("e2e-traveller@example.test")).toBeVisible()
  await page.getByRole("button", { name: /proceed to payment/i }).click()
  await expect(page).toHaveURL(/\/payment\?/)
  await expect(page.getByText(/pending verification/i)).toBeVisible()
})

test("@critical payment submission never claims a verified booking", async ({ page }) => {
  await page.goto("/payment?type=stay&id=dalhousie&total=4500")
  await page.getByLabel("UTR / Transaction Reference").fill("E2E123456")
  await page.getByRole("button", { name: /submit payment details/i }).click()

  await expect(page.getByRole("heading", { name: /payment details submitted/i })).toBeVisible()
  await expect(page.getByText(/not confirmed/i)).toBeVisible()
  await expect(page.getByText(/^You're in\.$/i)).toHaveCount(0)
})

test("@critical direct confirmation URL cannot manufacture a confirmed state", async ({ page }) => {
  await page.goto("/confirmed?type=stay&id=dalhousie")
  await expect(page.getByText(/^You're in\.$/i)).toHaveCount(0)
  await expect(page.getByText(/unable to verify|booking reference|required|pending verification/i)).toBeVisible()
})
