/* eslint-disable testing-library/prefer-screen-queries */
import { test, expect } from "@playwright/test"

test("works", async ({ page }) => {
  await page.goto("http://localhost:5174")

  // * rows are visible
  await expect(page.getByText("Workout")).toBeVisible()
  await expect(page.getByText("Shopping")).toBeVisible()
  await expect(page.getByText("Cooking")).toBeVisible()

  // * submit a new todo
  await page.locator('input[type="text"]').fill("Homework")
  await page.locator('button[type="button"]').first().click()

  // * new todo is visible
  await expect(page.getByText("Homework")).toBeVisible()

  // * delete a todo
  await page.locator('button[type="button"]').nth(1).click()
  await expect(page.getByText("Workout")).not.toBeVisible()
})
