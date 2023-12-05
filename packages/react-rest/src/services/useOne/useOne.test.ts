// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import {
  createStore,
  flattenResourcesIntoRecords,
} from "@hatchifyjs/rest-client"
import type { RestClient, Subscription } from "@hatchifyjs/rest-client"
import { useOne } from "./useOne"
import { assembler, string } from "@hatchifyjs/core"

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

const fakeDataSource: RestClient<any, any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () => Promise.resolve([{ records: [], related: [] }, {}]),
  findOne: () => Promise.resolve({ record: fakeData[0], related: [] }),
  createOne: () => Promise.resolve({ record: {} as any, related: [] }),
  updateOne: () => Promise.resolve({ record: {} as any, related: [] }),
  deleteOne: () => Promise.resolve(),
}

const schemas = assembler({
  Article: {
    name: "Article",
    attributes: { title: string(), body: string() },
  },
})

describe("react-rest/services/useOne", () => {
  it("should fetch a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", { id: "1" }),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData[0], []),
        {
          status: "success",
          meta: undefined,
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

  it("Works if query is a string", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", "1"),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData[0], []),
        {
          status: "success",
          meta: undefined,
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
    const store = createStore(["Article"])

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", {
        id: "1",
        fields: { Article: [""] },
      }),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData[0], []),
        {
          status: "success",
          meta: undefined,
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
        id: "1",
        __schema: "Article",
        attributes: { title: "new title", body: "new body" },
      },
    ]
    fakeDataSource.findOne = () =>
      Promise.resolve({ record: newFakeData[0], related: [] })

    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber([]),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, newFakeData[0], []),
        {
          status: "success",
          meta: undefined,
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

    const errors = [
      {
        code: "missing-resource",
        source: {},
        status: 404,
        title: "Resource not found",
      },
    ]

    fakeDataSource.findOne = () => Promise.reject(errors)

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", { id: "1" }),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        undefined,
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
