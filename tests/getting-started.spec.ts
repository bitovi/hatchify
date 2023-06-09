import { test, expect } from "@playwright/test"

test("works", async ({ page }) => {
  const backend = "http://localhost:3000"
  const frontend = "http://localhost:5173"
  let response
  let json

  // validate backend is running
  await page.goto(backend)
  await expect(page.getByText("Not found")).toBeVisible()

  // validate todos endpoint exists
  response = await page.goto(`${backend}/api/todos`)
  if (!response) throw new Error("No response")
  json = await response.json()
  expect(json.data).toEqual([])

  // validate users endpoint exists
  response = await page.goto(`${backend}/api/users`)
  if (!response) throw new Error("No response")
  json = await response.json()
  expect(json.data).toEqual([])

  // validate frontend is running
  await page.goto(frontend)
  await expect(page.getByText("Name")).toBeVisible()
  await expect(page.getByText("Due Date")).toBeVisible()
  await expect(page.getByText("Importance")).toBeVisible()
  await expect(page.getByText("user")).toBeVisible()

  // todo:
  // * post user
  // * post todos with relationship to user

  // * validate todos endpoint returns todos
  // * validate users endpoint returns users

  // * validate frontend shows todos with user
})
