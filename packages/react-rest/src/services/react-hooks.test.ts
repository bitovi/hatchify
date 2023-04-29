// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "data"
import { useList } from "./react-hooks"
import { articles } from "../../../shared/mocks/handlers"

describe("react-rest/services/react-hooks", () => {
  describe("useList", () => {
    it("should fetch a list of records", async () => {
      createStore(["articles"])
      const { result } = renderHook(() => useList("articles", {}))

      await waitFor(() => expect(result.current).toEqual([articles]))
    })
  })
})
