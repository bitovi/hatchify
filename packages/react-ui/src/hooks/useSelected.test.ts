import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useSelected from "./useSelected"

describe("useSelected", () => {
  it("works", async () => {
    const onSelectCallback = vi.fn()
    const { result } = renderHook(() => useSelected([], onSelectCallback))

    expect(result.current.selected).toEqual([])

    await waitFor(() => {
      result.current.setSelected(["1", "2", "3"])
    })

    expect(result.current.selected).toEqual(["1", "2", "3"])

    await waitFor(() => {
      result.current.setSelected(["1", "2"])
    })

    expect(result.current.selected).toEqual(["1", "2"])

    await waitFor(() => {
      result.current.setSelected([])
    })

    expect(result.current.selected).toEqual([])

    expect(onSelectCallback.mock.calls).toEqual([
      [["1", "2", "3"]],
      [["1", "2"]],
      [[]],
    ])
  })
})
