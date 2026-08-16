import { expect, test } from "@playwright/test"

const required = [
  "E2E_ALLOW_WRITES",
  "E2E_SUPABASE_URL",
  "E2E_SUPABASE_SERVICE_ROLE_KEY",
  "E2E_USER_EMAIL",
  "E2E_USER_PASSWORD",
]

test("dedicated write-test environment is explicitly isolated", async () => {
  test.skip(!process.env.E2E_ALLOW_WRITES, "write tests require an explicit non-production opt-in")
  const missing = required.filter((name) => !process.env[name])
  expect(missing, `missing protected E2E variables: ${missing.join(", ")}`).toEqual([])

  const testUrl = new URL(process.env.E2E_SUPABASE_URL!)
  const appUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL) : null
  expect(process.env.E2E_ALLOW_WRITES).toBe("true")
  expect(testUrl.protocol).toBe("https:")
  expect(testUrl.hostname).not.toBe(appUrl?.hostname)
})
