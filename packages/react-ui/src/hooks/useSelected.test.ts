import { describe, expect, it, vi } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useSelected from "./useSelected"

describe("useSelected", () => {
  it("works", async () => {
    const onSelectCallback = vi.fn()
    const { result } = renderHook(() =>
      useSelected({ all: false, ids: [] }, onSelectCallback),
    )

    expect(result.current.selected).toEqual({ all: false, ids: [] })

    await waitFor(() => {
      result.current.setSelected({ all: true, ids: ["1", "2", "3"] })
    })

    expect(result.current.selected).toEqual({ all: true, ids: ["1", "2", "3"] })

    await waitFor(() => {
      result.current.setSelected({ all: false, ids: ["1", "2"] })
    })

    expect(result.current.selected).toEqual({ all: false, ids: ["1", "2"] })

    await waitFor(() => {
      result.current.setSelected({ all: false, ids: [] })
    })

    expect(result.current.selected).toEqual({ all: false, ids: [] })

    expect(onSelectCallback.mock.calls).toEqual([
      [{ all: true, ids: ["1", "2", "3"] }],
      [{ all: false, ids: ["1", "2"] }],
      [{ all: false, ids: [] }],
    ])
  })
})
