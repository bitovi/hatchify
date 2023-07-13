import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useHatchifyListCheckboxes from "./useHatchifyRowSelect"

describe("useHatchifyListCheckboxes", () => {
  it("works", async () => {
    const { result } = renderHook(() => useHatchifyListCheckboxes())

    expect(result.current.checked).toEqual([])

    await waitFor(() => {
      result.current.setChecked(["1", "2", "3"])
    })

    expect(result.current.checked).toEqual(["1", "2", "3"])

    await waitFor(() => {
      result.current.setChecked(["4", "5", "6"])
    })

    expect(result.current.checked).toEqual(["4", "5", "6"])

    await waitFor(() => {
      result.current.toggleChecked("4")
    })

    await waitFor(() => {
      result.current.toggleChecked("1")
    })

    expect(result.current.checked).toEqual(["5", "6", "1"])

    await waitFor(() => {
      result.current.clearChecked()
    })

    expect(result.current.checked).toEqual([])
  })
})
