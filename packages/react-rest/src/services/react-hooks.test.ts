// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "data-core"
import { data, fixtures } from "source-fixtures"
import { useList } from "./react-hooks"

describe("react-rest/services/react-hooks", () => {
  describe("useList", () => {
    it("should fetch a list of records", async () => {
      createStore(["articles"])
      const dataSource = fixtures()

      const { result } = renderHook(() => useList(dataSource, "articles", {}))

      await waitFor(() => expect(result.current).toEqual([data.articles]))
    })
  })
})
