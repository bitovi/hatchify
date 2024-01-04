import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useFilter from "./useFilter.js"

describe("usePage", () => {
  it("works", async () => {
    const { result } = renderHook(() => useFilter())

    expect(result.current.filter).toEqual(undefined)

    await waitFor(() => {
      result.current.setFilter([
        { field: "name", value: "Walk the dog", operator: "$eq" },
      ])
    })

    expect(result.current.filter).toEqual([
      { field: "name", value: "Walk the dog", operator: "$eq" },
    ])
  })
})
