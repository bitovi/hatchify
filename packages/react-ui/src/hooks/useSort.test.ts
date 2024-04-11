import { describe, expect, it } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import useSort from "./useSort.js"

describe("useSort", () => {
  it("works when alwaysSorted is false", async () => {
    const { result } = renderHook(() => useSort())

    // initial state
    expect(result.current.sort).toEqual({
      alwaysSorted: false,
      direction: undefined,
      sortBy: undefined,
    })
    expect(result.current.sortQueryString).toEqual("")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after first click, undefined -> asc
    expect(result.current.sort).toEqual({
      alwaysSorted: false,
      direction: "asc",
      sortBy: "name",
    })
    expect(result.current.sortQueryString).toEqual("name")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after second click, asc -> desc
    expect(result.current.sort).toEqual({
      alwaysSorted: false,
      direction: "desc",
      sortBy: "name",
    })
    expect(result.current.sortQueryString).toEqual("-name")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after third click, desc -> undefined
    expect(result.current.sort).toEqual({
      alwaysSorted: false,
      direction: undefined,
      sortBy: undefined,
    })
    expect(result.current.sortQueryString).toEqual("")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after fourth click, undefined -> asc
    expect(result.current.sort).toEqual({
      alwaysSorted: false,
      direction: "asc",
      sortBy: "name",
    })
    expect(result.current.sortQueryString).toEqual("name")

    await waitFor(() => {
      result.current.setSort("date")
    })

    // after new column click, asc
    expect(result.current.sort).toEqual({
      alwaysSorted: false,
      direction: "asc",
      sortBy: "date",
    })
    expect(result.current.sortQueryString).toEqual("date")
  })

  it("works when alwaysSorted is true", async () => {
    const { result } = renderHook(() =>
      useSort({ direction: undefined, sortBy: undefined, alwaysSorted: true }),
    )

    // initial state
    expect(result.current.sort).toEqual({
      direction: undefined,
      sortBy: undefined,
      alwaysSorted: true,
    })
    expect(result.current.sortQueryString).toEqual("")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after first click, undefined -> asc
    expect(result.current.sort).toEqual({
      direction: "asc",
      sortBy: "name",
      alwaysSorted: true,
    })
    expect(result.current.sortQueryString).toEqual("name")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after second click, asc -> desc
    expect(result.current.sort).toEqual({
      direction: "desc",
      sortBy: "name",
      alwaysSorted: true,
    })
    expect(result.current.sortQueryString).toEqual("-name")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after third click, desc -> asc
    expect(result.current.sort).toEqual({
      direction: "asc",
      sortBy: "name",
      alwaysSorted: true,
    })
    expect(result.current.sortQueryString).toEqual("name")

    await waitFor(() => {
      result.current.setSort("name")
    })

    // after fourth click, asc -> desc
    expect(result.current.sort).toEqual({
      direction: "desc",
      sortBy: "name",
      alwaysSorted: true,
    })
    expect(result.current.sortQueryString).toEqual("-name")

    await waitFor(() => {
      result.current.setSort("date")
    })

    // after new column click, asc
    expect(result.current.sort).toEqual({
      direction: "asc",
      sortBy: "date",
      alwaysSorted: true,
    })
    expect(result.current.sortQueryString).toEqual("date")
  })
})
