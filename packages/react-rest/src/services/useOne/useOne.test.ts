// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore, convertResourceToRecord } from "@hatchifyjs/data-core"
import type { Resource, Source, Subscription } from "@hatchifyjs/data-core"
import { useOne } from "./useOne"

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
  getList: () => Promise.resolve({ data: [] as Resource[] }),
  getOne: () => Promise.resolve({ data: fakeData[0] }),
  createOne: () => Promise.resolve({ data: {} as Resource }),
}

describe("react-rest/services/useOne", () => {
  const query = { id: "1" }

  it("should fetch a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useOne(fakeDataSource, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        convertResourceToRecord(fakeData[0]),
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

    const { result } = renderHook(() =>
      useOne(fakeDataSource, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        convertResourceToRecord(fakeData[0]),
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
        id: "1",
        __schema: "Article",
        attributes: { title: "new title", body: "new body" },
      },
    ]

    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber(newFakeData.map(convertResourceToRecord)),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        convertResourceToRecord(newFakeData[0]),
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

    fakeDataSource.getOne = () =>
      Promise.reject(new Error("Something went wrong"))

    const { result } = renderHook(() =>
      useOne(fakeDataSource, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        undefined,
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
