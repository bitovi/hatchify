import { test, expect } from "@playwright/test"

test("works", async ({ page }) => {
  const messages: string[] = []

  page.on(
    "console",
    (message) => message.type() === "assert" && messages.push(message.text()),
  )

  await page.goto("http://localhost:5175", { waitUntil: "networkidle" })

  await expect(
    page.getByRole("tab", { name: "Article", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole("tab", { name: "Feature Article", exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole("tab", { name: "Admin User", exact: true }),
  ).toBeVisible()

  expect(messages).toEqual([])
})
