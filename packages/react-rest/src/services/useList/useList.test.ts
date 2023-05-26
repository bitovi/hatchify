// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore, convertResourceToRecord } from "@hatchifyjs/rest-client"
import type { Schema, Source, Subscription } from "@hatchifyjs/rest-client"
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
  getList: () => Promise.resolve(fakeData),
  getOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () => Promise.resolve([]),
  deleteOne: () => Promise.resolve(),
}

const ArticleSchema = {
  name: "Article",
  displayAttribute: "title",
  attributes: { title: "string", body: "string" },
} as Schema
const schemas = { Article: ArticleSchema }

describe("react-rest/services/useList", () => {
  it("should fetch a list of records", async () => {
    createStore(["Article"])
    const query = {}

    const { result } = renderHook(() =>
      useList(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        fakeData.map(convertResourceToRecord),
        {
          status: "success",
          meta: undefined,
          error: undefined,
          isDone: true,
          isLoading: false,
          isRejected: false,
          isRevalidating: false,
          isStale: false,
          isSuccess: true,
        },
      ]),
    )
  })

  it("should subscribe and return latest data", async () => {
    const store = createStore(["Article"])
    const query = {}

    const { result } = renderHook(() =>
      useList(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        fakeData.map(convertResourceToRecord),
        {
          status: "success",
          meta: undefined,
          error: undefined,
          isDone: true,
          isLoading: false,
          isRejected: false,
          isRevalidating: false,
          isStale: false,
          isSuccess: true,
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
          meta: undefined,
          error: undefined,
          isDone: true,
          isLoading: false,
          isRejected: false,
          isRevalidating: false,
          isStale: false,
          isSuccess: true,
        },
      ]),
    )
  })

  it("should return an error", async () => {
    createStore(["Article"])
    const query = {}

    fakeDataSource.getList = () =>
      Promise.reject(new Error("Something went wrong"))

    const { result } = renderHook(() =>
      useList(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        [],
        {
          status: "error",
          meta: undefined,
          error: new Error("Something went wrong"),
          isDone: true,
          isLoading: false,
          isRejected: true,
          isRevalidating: false,
          isStale: false,
          isSuccess: false,
        },
      ]),
    )
  })
})
