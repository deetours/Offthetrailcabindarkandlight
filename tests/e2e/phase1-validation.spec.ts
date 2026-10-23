import { test, expect } from "@playwright/test"

test.describe("Phase 1 Validation: Stays Collection & Room Listing", () => {
  test("Stays collection correctly displays Dalhousie and Jibhi with HP label", async ({ page }) => {
    test.slow()
    await page.goto("/stays", { timeout: 60000 })
    await expect(page.locator("h1")).toContainText("Places")

    // 1. Regional label displays HP
    const hpLabel = page.locator("span", { hasText: /^HP$/ })
    await expect(hpLabel).toBeVisible()

    // 2. Property count displays 2 Properties
    await expect(page.getByText("2", { exact: true }).first()).toBeVisible()
    await expect(page.getByText("Properties", { exact: true }).first()).toBeVisible()

    // 3. Dalhousie card
    const dalhousieLink = page.locator("a[href='/stays/dalhousie']")
    await expect(dalhousieLink).toHaveCount(1)
    await dalhousieLink.scrollIntoViewIfNeeded()
    await expect(dalhousieLink).toBeVisible()

    // Verify non-zero rendered card dimensions (Bento grid large cell: height > 400px)
    const dalhousieBox = await dalhousieLink.boundingBox()
    expect(dalhousieBox).not.toBeNull()
    expect(dalhousieBox!.height).toBeGreaterThan(400)
    expect(dalhousieBox!.width).toBeGreaterThan(300)

    // Dalhousie title, location and tagline
    await expect(dalhousieLink.getByRole("heading", { name: "Dalhousie Estate" })).toBeVisible()
    await expect(dalhousieLink.getByText("Dalhousie, HP")).toBeVisible()
    await expect(dalhousieLink.getByText("Trade the noise for silence.", { exact: true })).toBeVisible()

    // Dalhousie background image
    const dalhousieImgDiv = dalhousieLink.locator(".bg-cover").first()
    const dalhousieBgStyle = await dalhousieImgDiv.getAttribute("style")
    expect(dalhousieBgStyle).toContain("/images/offthetrail7.jpeg")

    // Dalhousie starting price & hover story
    await expect(dalhousieLink.getByText("₹3,200")).toBeAttached()
    await expect(dalhousieLink.getByText("Ten rooms along Bakrota Ridge. Trade the noise for silence.")).toBeAttached()

    // 4. Jibhi card
    const jibhiLink = page.locator("a[href='/stays/jibhi-canopy']")
    await expect(jibhiLink).toHaveCount(1)
    await jibhiLink.scrollIntoViewIfNeeded()
    await expect(jibhiLink).toBeVisible()

    // Verify non-zero rendered card dimensions (Bento grid cell: height > 300px)
    const jibhiBox = await jibhiLink.boundingBox()
    expect(jibhiBox).not.toBeNull()
    expect(jibhiBox!.height).toBeGreaterThan(300)
    expect(jibhiBox!.width).toBeGreaterThan(300)

    const jibhiCard = jibhiLink.getByRole("heading", { name: "Jibhi Canopy Cottages" })
    await expect(jibhiCard).toBeVisible()
    const jibhiImgDiv = jibhiLink.locator(".bg-cover").first()
    const jibhiBgStyle = await jibhiImgDiv.getAttribute("style")
    expect(jibhiBgStyle).toContain("/Jibhi.jpg")

    // Take verified screenshot of the rendered cards
    await page.screenshot({ path: "test-results/stays-rendered.png", fullPage: true })
  })

  test("Dalhousie landing page displays existing three room categories and verified rates", async ({ page }) => {
    test.slow()
    await page.goto("/stays/dalhousie", { timeout: 60000 })
    await expect(page.locator("h1, h2").first()).toBeVisible()

    const roomsSection = page.locator("#rooms")
    await expect(roomsSection).toBeVisible()

    // Verify all 3 categories
    const superDeluxe = roomsSection.getByRole("heading", { name: "Super Deluxe Room", exact: true })
    const deluxe = roomsSection.getByRole("heading", { name: "Deluxe Room", exact: true })
    const standard = roomsSection.getByRole("heading", { name: "Standard Room", exact: true })

    await expect(superDeluxe).toBeVisible()
    await expect(deluxe).toBeVisible()
    await expect(standard).toBeVisible()

    // Verify verified prices
    await expect(roomsSection.getByText("₹4,800")).toBeVisible()
    await expect(roomsSection.getByText("₹4,000")).toBeVisible()
    await expect(roomsSection.getByText("₹3,200")).toBeVisible()
  })
})
