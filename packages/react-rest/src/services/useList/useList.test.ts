// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore, convertResourceToRecord } from "data-core"
import type { Resource, Source, Subscription } from "data-core"
import { useList } from "./useList"

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
  version: 0,
  getList: () => Promise.resolve({ data: fakeData }),
  getOne: () => Promise.resolve({ data: {} as Resource }),
  createOne: () => Promise.resolve({ data: {} as Resource }),
}

describe("react-rest/services/useList", () => {
  it("should fetch a list of records", async () => {
    createStore(["Article"])

    const { result } = renderHook(() => useList(fakeDataSource, "Article", {}))

    await waitFor(() =>
      expect(result.current).toEqual([
        fakeData.map(convertResourceToRecord),
        {
          status: "success",
          loading: false,
          error: undefined,
          isLoading: false,
          isDone: true,
          isRejected: false,
        },
      ]),
    )
  })

  it("should subscribe and return latest data", async () => {
    const store = createStore(["Article"])

    const { result } = renderHook(() => useList(fakeDataSource, "Article", {}))

    await waitFor(() =>
      expect(result.current).toEqual([
        fakeData.map(convertResourceToRecord),
        {
          status: "success",
          loading: false,
          error: undefined,
          isLoading: false,
          isDone: true,
          isRejected: false,
        },
      ]),
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

    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber(newFakeData.map(convertResourceToRecord)),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        newFakeData.map(convertResourceToRecord),
        {
          status: "success",
          loading: false,
          error: undefined,
          isDone: true,
          isLoading: false,
          isRejected: false,
        },
      ]),
    )
  })

  it("should return an error", async () => {
    createStore(["Article"])

    fakeDataSource.getList = () =>
      Promise.reject(new Error("Something went wrong"))

    const { result } = renderHook(() => useList(fakeDataSource, "Article", {}))

    await waitFor(() =>
      expect(result.current).toEqual([
        [],
        {
          status: "error",
          loading: false,
          error: new Error("Something went wrong"),
          isLoading: false,
          isDone: false,
          isRejected: true,
        },
      ]),
    )
  })
})
