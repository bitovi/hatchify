import { describe, expect, it, vi } from "vitest"
import { render, renderHook, waitFor } from "@testing-library/react"

import { HatchifyList } from "./HatchifyList"
import type { Schema } from "@hatchifyjs/rest-client"
import { useHatchifyListSort } from "./useHatchifyListSort"

const TestSchema: Schema = {
  name: "Test",
  attributes: { id: "string", name: "string" },
  displayAttribute: "name",
}

describe("hatchifyjs/components/HatchifyList", () => {
  describe("HatchifyList", () => {
    it("works", () => {
      render(
        <HatchifyList
          allSchemas={{ Test: TestSchema }}
          schemaName="Test"
          useData={vi.fn()}
        />,
      )
    })
  })

  describe("useHatchifyListSort", () => {
    it("works", async () => {
      const { result } = renderHook(() => useHatchifyListSort())

      // initial state
      expect(result.current.sort).toEqual({
        direction: undefined,
        sortBy: undefined,
      })
      expect(result.current.sortQueryString).toEqual("")

      await waitFor(() => {
        result.current.setSort("name")
      })

      // after first click, undefined -> asc
      expect(result.current.sort).toEqual({
        direction: "asc",
        sortBy: "name",
      })
      expect(result.current.sortQueryString).toEqual("name")

      await waitFor(() => {
        result.current.setSort("name")
      })

      // after second click, asc -> desc
      expect(result.current.sort).toEqual({
        direction: "desc",
        sortBy: "name",
      })
      expect(result.current.sortQueryString).toEqual("-name")

      await waitFor(() => {
        result.current.setSort("name")
      })

      // after third click, desc -> undefined
      expect(result.current.sort).toEqual({
        direction: undefined,
        sortBy: undefined,
      })
      expect(result.current.sortQueryString).toEqual("")

      await waitFor(() => {
        result.current.setSort("name")
      })

      // after fourth click, undefined -> asc
      expect(result.current.sort).toEqual({
        direction: "asc",
        sortBy: "name",
      })
      expect(result.current.sortQueryString).toEqual("name")

      await waitFor(() => {
        result.current.setSort("date")
      })

      // after new column click, asc
      expect(result.current.sort).toEqual({
        direction: "asc",
        sortBy: "date",
      })
      expect(result.current.sortQueryString).toEqual("date")
    })
  })
})
