import { test, expect } from "@playwright/test"

test("works", async ({ page }) => {
  const messages: string[] = []

  page.on(
    "console",
    (message) => message.type() === "assert" && messages.push(message.text()),
  )

  await page.goto("http://localhost:5175", { waitUntil: "networkidle" })

  await expect(page.getByText("ARTICLE")).toBeVisible()
  await expect(page.getByText("FEATURE ARTICLE")).toBeVisible()
  await expect(page.getByText("ADMIN USER")).toBeVisible()

  expect(messages).toEqual([])
})
