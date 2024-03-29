// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { assembler, integer } from "@hatchifyjs/core"
import {
  createStore,
  flattenResourcesIntoRecords,
  subscribeToAll,
} from "@hatchifyjs/rest-client"
import type { RestClient, Subscription } from "@hatchifyjs/rest-client"
import { useAll } from "./useAll.js"

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

const fakeDataSource: RestClient<any, any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () =>
    Promise.resolve([{ records: fakeData, related: [] }, fakeMeta]),
  findOne: () => Promise.resolve({ record: {} as any, related: [] }),
  createOne: () => Promise.resolve({ record: {} as any, related: [] }),
  updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
  deleteOne: () => Promise.resolve(),
}

const schemas = assembler({
  Article: {
    name: "Article",
    attributes: {
      views: integer(),
    },
  },
})

describe("react-rest/services/useAll", () => {
  it("should fetch a list of records", async () => {
    createStore(["Article"])
    const query = {}

    const { result } = renderHook(() =>
      useAll(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, []),
        {
          status: "success",
          meta: fakeMeta,
          error: undefined,
          isResolved: true,
          isPending: false,
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
        flattenResourcesIntoRecords(schemas, fakeData, []),
        {
          status: "success",
          meta: fakeMeta,
          error: undefined,
          isResolved: true,
          isPending: false,
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
    fakeDataSource.findAll = () =>
      Promise.resolve([{ records: newFakeData, related: [] }, fakeMeta])

    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber([]),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, newFakeData, []),
        {
          status: "success",
          meta: fakeMeta,
          error: undefined,
          isResolved: true,
          isPending: false,
          isRejected: false,
          isRevalidating: false,
          isStale: false,
          isSuccess: true,
        },
      ]),
    )

    fakeDataSource.findAll = () =>
      Promise.resolve([{ records: [], related: [] }, {}])

    // unrelated schema subscribe(mutate) should trigger refetch
    // todo: remove once subscribe/can-query-logic is properly implemented
    subscribeToAll("Person", query, () => [])
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
          isResolved: true,
          isPending: false,
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

    const errors = [
      {
        code: "invalid-query",
        source: {},
        status: 422,
        title: "Invalid query",
      },
    ]

    fakeDataSource.findAll = () => Promise.reject(errors)

    const { result } = renderHook(() =>
      useAll(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        [],
        {
          status: "error",
          meta: undefined,
          error: errors,
          isResolved: true,
          isPending: false,
          isRejected: true,
          isRevalidating: false,
          isStale: false,
          isSuccess: false,
        },
      ]),
    )
  })
})
