// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "data-core"
import type { Source } from "data-core"
import { useList } from "./react-hooks"

const fakeData = [
  { id: "1", title: "foo", body: "foo-body" },
  { id: "2", title: "bar", body: "bar-body" },
]

const fakeDataSource: Source = {
  getList: () =>
    Promise.resolve({
      data: fakeData,
    }),
}

describe("react-rest/services/react-hooks", () => {
  describe("useList", () => {
    it("should fetch a list of records", async () => {
      createStore(["articles"])

      const { result } = renderHook(() =>
        useList(fakeDataSource, "articles", {}),
      )

      await waitFor(() => expect(result.current).toEqual([fakeData]))
    })

    it("should subscribe and return latest data", async () => {
      createStore(["articles"])

      const { result } = renderHook(() =>
        useList(fakeDataSource, "articles", {}),
      )

      await waitFor(() => expect(result.current).toEqual([fakeData]))

      const newFakeData = [
        { id: "3", title: "baz", body: "baz-body" },
        { id: "4", title: "qux", body: "qux-body" },
      ]

      fakeDataSource.getList = () =>
        Promise.resolve({
          data: newFakeData,
        })

      await waitFor(() => expect(result.current).toEqual([newFakeData]))
    })
  })
})
