import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useFilter from "./useFilter"

describe("usePage", () => {
  it("works", async () => {
    const { result } = renderHook(() => useFilter())

    expect(result.current.filter).toEqual(undefined)

    await waitFor(() => {
      result.current.setFilter([{ name: "Walk the dog", operator: "$eq" }])
    })

    expect(result.current.filter).toEqual([
      { name: "Walk the dog", operator: "$eq" },
    ])
  })
})
