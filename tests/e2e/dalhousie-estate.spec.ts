import { test, expect } from "@playwright/test"
import { expectNoHorizontalOverflow, futureDate } from "../helpers/runtime"

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
      test.slow()
      const failed404s: string[] = []
      page.on("response", (res) => {
        if (res.status() === 404) {
          failed404s.push(res.url())
        }
      })

      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
      await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

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

      // Capture full-page post-implementation screenshot (allow 30s for web font loading)
      await page.screenshot({
        path: `test-artifacts/verified-${vp.name}.png`,
        fullPage: true,
        timeout: 30000,
      })
    })
  }

  test("Room Catalog 'Select this room' carries room selection to booking ledger", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Target the specific article containing the exact heading "Deluxe Room"
    const deluxeCard = page.locator("#rooms article").filter({
      has: page.getByRole("heading", { name: "Deluxe Room", exact: true }),
    })
    await expect(deluxeCard).toBeVisible()

    const selectButton = deluxeCard.getByRole("button", { name: /select this room/i })
    await selectButton.click({ force: true })

    // Verify it smoothly navigated to booking-flow
    const bookingSection = page.locator("#booking-flow")
    await expect(bookingSection).toBeVisible()

    // The Deluxe Room in the room ledger should be present
    const deluxeRow = page.locator("#booking-flow").getByRole("heading", { name: "Deluxe Room", exact: true })
    await expect(deluxeRow).toBeVisible()
  })

  test("Mobile sticky CTA appears past hero and dismisses before footer", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Scroll to Chapter II (past hero, before booking flow)
    await page.evaluate(() => {
      window.scrollTo(0, 1200)
      window.dispatchEvent(new Event("scroll"))
    })
    await page.waitForTimeout(500)

    const stickyCta = page.getByRole("button", { name: /check availability/i })
    await expect(stickyCta).toBeVisible()

    // Scroll all the way into the footer
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
      window.dispatchEvent(new Event("scroll"))
    })
    await page.waitForTimeout(500)

    // Verify sticky CTA dismisses before footer
    await expect(stickyCta).not.toBeVisible()
  })

  test("Guest Details form validates inputs accessibly and supports keyboard submission", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Set dates in Step 1
    const d1 = futureDate(10)
    const d2 = futureDate(12)
    const checkInInput = page.locator("#booking-checkin")
    const checkOutInput = page.locator("#booking-checkout")
    await checkInInput.fill(d1)
    await checkOutInput.fill(d2)

    // Select room via Room Ledger quantity stepper
    await page.getByRole("button", { name: "Increase Super Deluxe Room quantity" }).click()

    // Continue to Step 2
    const continueBtn = page.getByRole("button", { name: /continue to guest details/i })
    await expect(continueBtn).toBeEnabled()
    await continueBtn.click()

    // Step 2 is now visible: test empty submit triggers accessible validation
    const submitBtn = page.getByRole("button", { name: /continue to payment/i })
    await submitBtn.click()

    // Validation alerts appear
    await expect(page.getByRole("alert").first()).toBeVisible()

    // Fill in Name and Phone
    const nameInput = page.locator("#booking-fullname")
    const phoneInput = page.locator("#booking-phone")
    await nameInput.fill("Ananya Sharma")
    await phoneInput.fill("+91 98765 43210")

    // Test Enter key on phone input submits the form
    await phoneInput.press("Enter")

    // Advances to Step 3: Direct Estate Payment
    await expect(page.getByRole("heading", { name: /direct estate payment/i })).toBeVisible()
  })

  test("Step 2 dispatches non-blocking lead enquiry contract to /api/leads", async ({ page }) => {
    test.slow()
    let capturedPayload: any = null
    await page.route("**/api/leads", async (route) => {
      if (route.request().method() === "POST") {
        capturedPayload = route.request().postDataJSON()
        await route.fulfill({ status: 201, json: { message: "Lead captured", lead: { id: "test-uuid" } } })
      } else {
        await route.continue()
      }
    })

    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Set dates
    const d1 = futureDate(15)
    const d2 = futureDate(17)
    await page.locator("#booking-checkin").fill(d1)
    await page.locator("#booking-checkout").fill(d2)

    // Select room
    await page.getByRole("button", { name: "Increase Deluxe Room quantity" }).click()

    // Proceed to Step 2
    const continueBtn = page.getByRole("button", { name: /continue to guest details/i })
    await expect(continueBtn).toBeEnabled()
    await continueBtn.click()

    // Fill details
    await page.locator("#booking-fullname").fill("Vikram Malhotra")
    await page.locator("#booking-phone").fill("9816315898")

    // Submit Step 2
    await page.getByRole("button", { name: /continue to payment/i }).click()

    // Advances to Step 3 immediately (non-blocking)
    await expect(page.getByRole("heading", { name: /direct estate payment/i })).toBeVisible()

    // Verify /api/leads received the expected contract payload
    expect(capturedPayload).not.toBeNull()
    expect(capturedPayload.full_name).toBe("Vikram Malhotra")
    expect(capturedPayload.phone_number).toBe("9816315898")
    expect(capturedPayload.source).toBe("dalhousie_booking_enquiry")
    expect(capturedPayload.notes).toContain("Dalhousie Estate Enquiry")
  })

  test("Step 3 displays restrained UPI payment card with copy feedback and exact amount", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // 2 nights
    const d1 = futureDate(20)
    const d2 = futureDate(22)
    await page.locator("#booking-checkin").fill(d1)
    await page.locator("#booking-checkout").fill(d2)

    // 1x Super Deluxe (₹4,800 * 2 = ₹9,600)
    await page.getByRole("button", { name: "Increase Super Deluxe Room quantity" }).click()

    // Step 1 -> Step 2
    await page.getByRole("button", { name: /continue to guest details/i }).click()

    // Step 2 details
    await page.locator("#booking-fullname").fill("Rohan Verma")
    await page.locator("#booking-phone").fill("+91 98111 22233")
    await page.getByRole("button", { name: /continue to payment/i }).click()

    // In Step 3:
    const heading = page.getByRole("heading", { name: /direct estate payment/i })
    await expect(heading).toBeVisible()

    // Verify verified payee is Off The Trail
    await expect(page.getByText(/off the trail/i).first()).toBeVisible()

    // Verify exact calculated total ₹9,600 is displayed
    await expect(page.getByText("₹9,600").first()).toBeVisible()

    // Verify noisy budget badge is absent
    await expect(page.getByText(/zero gateway convenience fees/i)).toHaveCount(0)

    // Verify UPI ID and copy interaction
    await expect(page.getByText("offthetrail@upi").first()).toBeVisible()
    const copyBtn = page.getByRole("button", { name: /copy upi id/i })
    await expect(copyBtn).toBeVisible()
    await copyBtn.click()
    await expect(page.getByText("Copied")).toBeVisible()

    // Verify mobile deep link exists
    const deepLink = page.locator("a[href^='upi://pay']")
    await expect(deepLink).toHaveAttribute("href", /offthetrail@upi/)
  })

  test("Step 4 displays verification request with flexible reference, status copy, and WhatsApp handoff", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // Setup dates & room
    const d1 = futureDate(25)
    const d2 = futureDate(27)
    await page.locator("#booking-checkin").fill(d1)
    await page.locator("#booking-checkout").fill(d2)
    await page.getByRole("button", { name: "Increase Standard Room quantity" }).click()

    // Step 1 -> Step 2
    await page.getByRole("button", { name: /continue to guest details/i }).click()

    // Step 2 -> Step 3
    await page.locator("#booking-fullname").fill("Kavita Rao")
    await page.locator("#booking-phone").fill("9876543210")
    await page.getByRole("button", { name: /continue to payment/i }).click()

    // Step 3 -> Step 4
    const paymentCompletedBtn = page.getByRole("button", { name: /i have transferred/i })
    await expect(paymentCompletedBtn).toBeVisible()
    await paymentCompletedBtn.click()

    // In Step 4: Verify accurate status copy (not claiming confirmed)
    await expect(page.getByRole("heading", { name: /payment verification request/i })).toBeVisible()
    await expect(page.getByText(/pending owner verification/i)).toBeVisible()
    await expect(page.getByText(/^You're in\.$/i)).toHaveCount(0)

    // Verify reservation recap card
    await expect(page.getByText("Kavita Rao (9876543210)")).toBeVisible()
    await expect(page.getByText(/1x standard room/i)).toBeVisible()

    // Reference input test: WhatsApp button starts deactivated
    const whatsappBtn = page.locator("a").filter({ hasText: /send verification on whatsapp/i })
    await expect(whatsappBtn).toHaveClass(/opacity-40/)

    // Fill flexible transaction reference
    const utrInput = page.locator("#booking-utr")
    await utrInput.fill("UTR9876543210")

    // WhatsApp button becomes active
    await expect(whatsappBtn).not.toHaveClass(/opacity-40/)
    const href = await whatsappBtn.getAttribute("href")
    expect(href).toContain("wa.me/919816315898")
    expect(href).toContain("Kavita%20Rao")
    expect(href).toContain("UTR9876543210")

    // Desktop fallback: Copy booking summary
    const copySummaryBtn = page.getByRole("button", { name: /copy booking summary/i })
    await expect(copySummaryBtn).toBeEnabled()
    await copySummaryBtn.click()
    await expect(page.getByText(/booking summary copied/i)).toBeVisible()
  })

  test("Batch 5 & 6: TrustBar displays verified estate facts, zero fake toasts, and transparent policies", async ({ page }) => {
    test.slow()
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto("/stays/dalhousie-estate", { timeout: 60000 })
    await page.waitForSelector("[data-hydrated='true']", { state: "attached" })

    // 1. Verify TrustBar displays 4 verified estate differentiators
    const bookingSection = page.locator("#booking-flow")
    await expect(bookingSection.getByText("10 Secluded Rooms")).toBeVisible()
    await expect(bookingSection.getByText("Independently run on Bakrota Ridge")).toBeVisible()
    await expect(bookingSection.getByText("Drive-In & Parking")).toBeVisible()
    await expect(bookingSection.getByText("Paved road with private parking")).toBeVisible()
    await expect(bookingSection.getByText("Breakfast Included", { exact: true })).toBeVisible()
    await expect(bookingSection.getByText("Fresh hot breakfast with every stay")).toBeVisible()
    await expect(bookingSection.getByText("Owner Verified")).toBeVisible()
    await expect(bookingSection.getByText("Instant WhatsApp communication")).toBeVisible()

    // 2. Verify zero fake social proof toasts or fabricated review popups
    await page.waitForTimeout(1000)
    await expect(page.locator(".fixed.bottom-6.right-6")).toHaveCount(0)

    // 3. Verify Transparent Stay Policies strip in Step 1
    await expect(page.getByText(/Standard Double Occupancy \(2 Adults\/room\)/i)).toBeVisible()
    await expect(page.getByText(/Extra Bed & Breakfast: ₹1,200\/night/i)).toBeVisible()
    await expect(page.getByText(/Check-in 1:00 PM · Check-out 11:00 AM/i)).toBeVisible()
    await expect(page.getByText(/Free On-Site Private Parking/i)).toBeVisible()

    // 4. Verify 100% cancellation policy transparency
    await expect(page.getByText(/100% refund up to 7 days before check-in/i)).toBeVisible()
  })
})
