import { defineConfig, devices } from "@playwright/test"

const port = Number(process.env.E2E_PORT || 3100)
const baseURL = process.env.E2E_BASE_URL || `http://127.0.0.1:${port}`
const isExternalTarget = Boolean(process.env.E2E_BASE_URL)

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ["line"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["json", { outputFile: "test-artifacts/results.json" }],
  ],
  expect: { timeout: 10_000 },
  timeout: 45_000,
  use: {
    baseURL,
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    locale: "en-IN",
    timezoneId: "Asia/Kolkata",
  },
  webServer: isExternalTarget
    ? undefined
    : {
        command: `npm.cmd run dev -- --hostname 127.0.0.1 --port ${port}`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
        stdout: "pipe",
        stderr: "pipe",
      },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "firefox-desktop",
      grep: /@(smoke|critical|a11y)/,
      use: { ...devices["Desktop Firefox"], viewport: { width: 1366, height: 768 } },
    },
    {
      name: "webkit-desktop",
      grep: /@(smoke|critical|a11y)/,
      use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } },
    },
    {
      name: "mobile-chrome",
      grep: /@(smoke|critical|responsive|a11y)/,
      use: { ...devices["Pixel 7"] },
    },
    {
      name: "mobile-safari",
      grep: /@(smoke|critical|responsive|a11y)/,
      use: { ...devices["iPhone 14"] },
    },
    {
      name: "tablet",
      grep: /@(smoke|responsive)/,
      use: { ...devices["iPad Pro 11"] },
    },
  ],
})
