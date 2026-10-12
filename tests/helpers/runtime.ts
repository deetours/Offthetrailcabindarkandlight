import { expect, Page, TestInfo } from "@playwright/test"

const ignoredConsolePatterns = [
  /Download the React DevTools/i,
  /favicon/i,
  /Failed to load resource.*net::ERR_BLOCKED_BY_CLIENT/i,
]

export function monitorRuntime(page: Page, testInfo: TestInfo) {
  const consoleErrors: string[] = []
  const failedRequests: string[] = []

  page.on("console", (message) => {
    if (message.type() !== "error") return
    const text = message.text()
    if (!ignoredConsolePatterns.some((pattern) => pattern.test(text))) {
      consoleErrors.push(text)
    }
  })

  page.on("requestfailed", (request) => {
    const url = request.url()
    if (!url.startsWith("http://127.0.0.1") && !url.startsWith("http://localhost")) return
    failedRequests.push(`${request.method()} ${url}: ${request.failure()?.errorText || "unknown"}`)
  })

  return async () => {
    await testInfo.attach("runtime-errors", {
      body: JSON.stringify({ consoleErrors, failedRequests }, null, 2),
      contentType: "application/json",
    })
    expect(consoleErrors, "unexpected browser console errors").toEqual([])
    expect(failedRequests, "unexpected same-origin request failures").toEqual([])
  }
}

export async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
  }))
  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1)
}

export function futureDate(daysFromToday: number) {
  const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }))
  date.setDate(date.getDate() + daysFromToday)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
