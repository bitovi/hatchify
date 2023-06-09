// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import {
  createStore,
  flattenResourcesIntoRecords,
  subscribeToAll,
} from "@hatchifyjs/rest-client"
import type { Schema, Source, Subscription } from "@hatchifyjs/rest-client"
import { useAll } from "./useAll"

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

const fakeMeta = {
  unpaginatedCount: 2,
}

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([fakeData, fakeMeta]),
  findOne: () => Promise.resolve([]),
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

describe("react-rest/services/useAll", () => {
  it("should fetch a list of records", async () => {
    createStore(["Article"])
    const query = {}

    const { result } = renderHook(() =>
      useAll(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, "Article"),
        {
          status: "success",
          meta: fakeMeta,
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
    const store = createStore(["Article", "Person"])
    const query = {}

    const { result } = renderHook(() =>
      useAll(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, "Article"),
        {
          status: "success",
          meta: fakeMeta,
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
    fakeDataSource.findAll = () => Promise.resolve([newFakeData, fakeMeta])

    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber([]),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, newFakeData, "Article"),
        {
          status: "success",
          meta: fakeMeta,
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

    fakeDataSource.findAll = () => Promise.resolve([[], {}])

    // unrelated schema subscribe(mutate) should trigger refetch
    // todo: remove once subscribe/can-query-logic is properly implemented
    subscribeToAll("Person", () => [])
    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber([]),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        [],
        {
          status: "success",
          meta: {},
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

    fakeDataSource.findAll = () =>
      Promise.reject(new Error("Something went wrong"))

    const { result } = renderHook(() =>
      useAll(fakeDataSource, schemas, "Article", query),
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
