// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "data"
import { jsonapi } from "source-jsonapi"
import { useCreateOne, useList } from "./react-hooks"
import { articles, baseUrl } from "shared/mocks/handlers"

describe("react-rest/services/react-hooks", () => {
  describe("useList", () => {
    it("should fetch a list of records", async () => {
      createStore(["articles"])
      const dataSource = jsonapi({ baseUrl })

      const { result } = renderHook(() => useList(dataSource, "articles", {}))

      await waitFor(() => expect(result.current).toEqual([articles]))
    })
  })

  describe("useCreateOne", () => {
    it("should create a record", async () => {
      // @todo tests are passing but the following 2 lines are giving an error: `TypeError: fetch failed`
      createStore(["articles"])
      const dataSource = jsonapi({ baseUrl })
      const expected = {
        id: `article-id-${articles.length + 1}`,
        type: "Article",
        attributes: {
          title: "New Article",
          body: "New Body",
        },
      }

      const { result } = renderHook(() => useCreateOne(dataSource, "articles"))

      await waitFor(() =>
        expect(result.current).toEqual([
          expect.any(Function),
          undefined,
          undefined,
        ]),
      )

      await result.current[0]({ title: "New Article", body: "New Body" })

      await waitFor(() =>
        expect(result.current).toEqual([
          expect.any(Function),
          undefined,
          expected,
        ]),
      )
    })
  })
})
