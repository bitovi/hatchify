import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useFilters from "./useFilter"

describe("usePage", () => {
  it("works", async () => {
    const { result } = renderHook(() => useFilters())

    expect(result.current.filters).toEqual(undefined)

    await waitFor(() => {
      result.current.setFilters([{ value: "Walk the dog", operator: "$eq" }])
    })

    expect(result.current.filters).toEqual([
      { value: "Walk the dog", operator: "$eq" },
    ])
  })
})
