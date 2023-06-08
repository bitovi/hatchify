import { test, expect } from "@playwright/test"

test("works", async ({ page }) => {
  // await page.goto("http://localhost:5173/")

  // Table columns exist
  // await expect(page.getByText("Name")).toBeVisible()
  // await expect(page.getByText("Due Date")).toBeVisible()
  // await expect(page.getByText("Importance")).toBeVisible()
  // await expect(page.getByText("user")).toBeVisible()
  page.on("console", (m) => console.log(m.text()))
  const response = await fetch("http://localhost:3000/api/todos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data: {
        type: "Todo",
        attributes: {
          name: "Test",
          due_date: "2021-01-01",
          importance: 1,
        },
      },
    }),
  })

  const json = await response.json()
  console.log("json------------>", json)
})
