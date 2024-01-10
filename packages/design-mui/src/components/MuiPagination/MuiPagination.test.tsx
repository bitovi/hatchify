import "@testing-library/jest-dom"
import { act, render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import MuiPagination from "./MuiPagination.js"

describe("components/MuiPagination", () => {
  it("works", async () => {
    const setPage = vi.fn()

    const props = {
      page: { number: 1, size: 10 },
      setPage,
      meta: {
        meta: { unpaginatedCount: 100 },
      },
    } as any

    render(<MuiPagination {...props} />)

    await act(async () => {
      await screen.findByText("2").then((el) => el.click())
      await screen.findByText("3").then((el) => el.click())
      await screen.findByText("1").then((el) => el.click())
      await screen.findByText("10").then((el) => el.click())
    })

    expect(setPage.mock.calls).toEqual([
      [{ number: 2, size: 10 }],
      [{ number: 3, size: 10 }],
      [{ number: 1, size: 10 }],
      [{ number: 10, size: 10 }],
    ])
  })
})
