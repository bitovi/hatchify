// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import {
  createStore,
  flattenResourcesIntoRecords,
} from "@hatchifyjs/rest-client"
import type { Schema, Source, Subscription } from "@hatchifyjs/rest-client"
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
  findAll: () => Promise.resolve([]),
  findOne: () => Promise.resolve([fakeData[0]]),
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

describe("react-rest/services/useOne", () => {
  const query = { id: "1" }

  it("should fetch a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, "Article", "1"),
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

  it("Work if query is a string", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", "1"),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, "Article", "1"),
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

  it("Work if query.fields is empty object", async () => {
    createStore(["Article"])
    const queryFieldsObject = { id: "1", fields: {} }

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", queryFieldsObject),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, "Article", "1"),
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

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, fakeData, "Article", "1"),
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
        id: "1",
        __schema: "Article",
        attributes: { title: "new title", body: "new body" },
      },
    ]
    fakeDataSource.findOne = () => Promise.resolve(newFakeData)

    store.Article.subscribers.forEach((subscriber: Subscription) =>
      subscriber([]),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        flattenResourcesIntoRecords(schemas, newFakeData, "Article", "1"),
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

    fakeDataSource.findOne = () =>
      Promise.reject(new Error("Something went wrong"))

    const { result } = renderHook(() =>
      useOne(fakeDataSource, schemas, "Article", query),
    )

    await waitFor(() =>
      expect(result.current).toEqual([
        undefined,
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
