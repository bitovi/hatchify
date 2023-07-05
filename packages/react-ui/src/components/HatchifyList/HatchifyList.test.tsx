import { describe, it, vi } from "vitest"
import { render, renderHook, waitFor } from "@testing-library/react"

import { HatchifyList } from "./HatchifyList"
import type { Schema } from "@hatchifyjs/rest-client"
import { useHatchifyListSort } from "./UseHatchifyListSort"

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

  describe("UseHatchifyListSort", () => {
    it("works", async () => {
      const checkInitial = () => {
        expect(result.current.sort).toEqual({
          direction: undefined,
          sortBy: false,
        })
        expect(result.current.sortQueryString).toEqual("")
      }
      const { result } = renderHook(() => useHatchifyListSort())
      checkInitial()
    })

    it("changes sort direction to asc from undefined", async () => {
      const checkAsc = () => {
        expect(result.current.sort).toEqual({
          direction: "asc",
          sortBy: "name",
        })
        expect(result.current.sortQueryString).toEqual("name")
      }
      const { result } = renderHook(() => useHatchifyListSort())

      await waitFor(() => {
        result.current.changeSort({
          direction: undefined,
          sortBy: "name",
        })
      })

      checkAsc()
    })

    it("changes sort direction to desc from asc", async () => {
      const checkDesc = () => {
        expect(result.current.sort).toEqual({
          direction: "desc",
          sortBy: "name",
        })
        expect(result.current.sortQueryString).toEqual("-name")
      }
      const { result } = renderHook(() => useHatchifyListSort())

      await waitFor(() => {
        result.current.changeSort({
          direction: "asc",
          sortBy: "name",
        })
      })

      checkDesc()
    })

    it("changes sort direction to undefined and sortBy to false from desc", async () => {
      const checkUndefined = () => {
        expect(result.current.sort).toEqual({
          direction: undefined,
          sortBy: false,
        })
        expect(result.current.sortQueryString).toEqual("")
      }
      const { result } = renderHook(() => useHatchifyListSort())

      await waitFor(() => {
        result.current.changeSort({
          direction: "desc",
          sortBy: "name",
        })
      })

      checkUndefined()
    })
  })

  it("changes sortBy to new key and direction to asc when the key is changed", async () => {
    const checkInitial = () => {
      expect(result.current.sort).toEqual({
        direction: "desc",
        sortBy: "name",
      })
      expect(result.current.sortQueryString).toEqual("-name")
    }

    const checkKeyChange = () => {
      expect(result.current.sort).toEqual({
        direction: "asc",
        sortBy: "date",
      })
      expect(result.current.sortQueryString).toEqual("date")
    }
    const { result } = renderHook(() => useHatchifyListSort())

    await waitFor(() => {
      result.current.changeSort({
        direction: "asc",
        sortBy: "name",
      })
    })

    checkInitial()

    await waitFor(() => {
      result.current.changeSort({
        direction: undefined,
        sortBy: "date",
      })
    })

    checkKeyChange()
  })
})
