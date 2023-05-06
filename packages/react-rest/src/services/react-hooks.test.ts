// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore, convertResourceToRecord } from "data-core"
import type { Source } from "data-core"
import { useList } from "./react-hooks"

const fakeData = [
  {
    id: "1",
    __schema: "Article",
    attributes: { title: "foo", body: "foo-body" },
  },
  {
    id: "2",
    __schema: "Article",
    attributes: { title: "bar", body: "bar-body" },
  },
]

const fakeDataSource: Source = {
  version: "0.0.0",
  getList: () =>
    Promise.resolve({
      data: fakeData,
    }),
}

describe("react-rest/services/react-hooks", () => {
  describe("useList", () => {
    it("should fetch a list of records", async () => {
      createStore(["Article"])

      const { result } = renderHook(() =>
        useList(fakeDataSource, "Article", {}),
      )

      await waitFor(() =>
        expect(result.current).toEqual([fakeData.map(convertResourceToRecord)]),
      )
    })

    it("should subscribe and return latest data", async () => {
      createStore(["Article"])

      const { result } = renderHook(() =>
        useList(fakeDataSource, "Article", {}),
      )

      await waitFor(() =>
        expect(result.current).toEqual([fakeData.map(convertResourceToRecord)]),
      )

      const newFakeData = [
        {
          id: "3",
          __schema: "Article",
          attributes: { title: "baz", body: "baz-body" },
        },
        {
          id: "4",
          __schema: "Article",
          attributes: { title: "qux", body: "qux-body" },
        },
      ]

      fakeDataSource.getList = () =>
        Promise.resolve({
          data: newFakeData,
        })

      await waitFor(() =>
        expect(result.current).toEqual([
          newFakeData.map(convertResourceToRecord),
        ]),
      )
    })
  })
})
