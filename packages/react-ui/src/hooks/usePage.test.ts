import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import usePage from "./usePage.js"

describe("usePage", () => {
  it("renders hook, and setPage properly sets currentState", async () => {
    const { result } = renderHook(() => usePage())

    expect(result.current.page).toEqual({
      size: 10,
      number: 1,
    })

    await waitFor(() => {
      result.current.setPage({ size: 10, number: 2 })
    })

    expect(result.current.page).toEqual({
      size: 10,
      number: 2,
    })

    await waitFor(() => {
      result.current.setPage({ size: 15, number: 12 })
    })

    expect(result.current.page).toEqual({
      size: 15,
      number: 12,
    })
  })
})
