import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useHatchifyListPagination from "./useHatchifyListPagination"

describe("useHatchifyListPagination", () => {
  it("works", async () => {
    const { result } = renderHook(() => useHatchifyListPagination())

    expect(result.current.pagination).toEqual({
      size: 10,
      number: 1,
    })

    await waitFor(() => {
      result.current.setPagination({ size: 10, number: 2 })
    })

    expect(result.current.pagination).toEqual({
      size: 10,
      number: 2,
    })

    await waitFor(() => {
      result.current.setPagination({ size: 15, number: 12 })
    })

    expect(result.current.pagination).toEqual({
      size: 15,
      number: 12,
    })
  })
})
