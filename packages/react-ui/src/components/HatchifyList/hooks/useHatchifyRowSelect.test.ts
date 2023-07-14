import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useHatchifyRowSelect from "./useHatchifyRowSelect"

describe("useHatchifyRowSelect", () => {
  it("works", async () => {
    const { result } = renderHook(() => useHatchifyRowSelect())

    expect(result.current.selected).toEqual({})

    await waitFor(() => {
      result.current.setSelected({ "1": true, "2": true, "3": true })
    })

    expect(result.current.selected).toEqual({ "1": true, "2": true, "3": true })

    await waitFor(() => {
      result.current.setSelected(true)
    })

    expect(result.current.selected).toEqual(true)

    await waitFor(() => {
      result.current.setSelected({})
    })

    expect(result.current.selected).toEqual({})
  })
})
