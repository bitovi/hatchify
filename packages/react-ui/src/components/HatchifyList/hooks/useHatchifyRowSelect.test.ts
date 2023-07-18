import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useHatchifyRowSelect from "./useHatchifyRowSelect"

describe("useHatchifyRowSelect", () => {
  it("works", async () => {
    const onSelectCallback = vi.fn()
    const { result } = renderHook(() => useHatchifyRowSelect(onSelectCallback))

    expect(result.current.selected).toEqual({})

    await waitFor(() => {
      result.current.setSelected({ "1": true, "2": true, "3": true })
    })

    expect(result.current.selected).toEqual({ "1": true, "2": true, "3": true })

    await waitFor(() => {
      result.current.setSelected({ "1": true, "2": true })
    })

    expect(result.current.selected).toEqual({ "1": true, "2": true })

    await waitFor(() => {
      result.current.setSelected({})
    })

    expect(result.current.selected).toEqual({})

    expect(onSelectCallback.mock.calls).toEqual([
      [["1", "2", "3"]],
      [["1", "2"]],
      [[]],
    ])
  })
})
