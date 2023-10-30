// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/rest-client"
import type { Schema, Source } from "@hatchifyjs/rest-client"
import { useUpdateOne } from "./useUpdateOne"

const fakeDataSource: Source = {
  version: 0,
  completeSchemaMap: {},
  findAll: () => Promise.resolve([[], {}]),
  findOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () =>
    Promise.resolve([
      {
        id: "1",
        __schema: "Article",
        attributes: { title: "updated-title", body: "baz-body" },
      },
    ]),
  deleteOne: () => Promise.resolve(),
}

const ArticleSchema = {
  name: "Article",
  displayAttribute: "title",
  attributes: { title: "string", body: "string" },
} as Schema
const schemas = { Article: ArticleSchema }

describe("react-rest/services/useUpdateOne", () => {
  it("should update a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useUpdateOne(fakeDataSource, schemas, "Article"),
    )

    await waitFor(() => {
      expect(result.current).toEqual([
        expect.any(Function),
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
        undefined,
      ])
    })

    await result.current[0]({
      id: "1",
      attributes: { title: "updated-title", body: "baz-body" },
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
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
        {
          id: "1",
          __schema: "Article",
          title: "updated-title",
          body: "baz-body",
        },
      ]),
    )
  })

  it("should return an error if the request fails and clear it after success", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useUpdateOne(fakeDataSource, schemas, "Article"),
    )

    await waitFor(() => {
      expect(result.current).toEqual([
        expect.any(Function),
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
        undefined,
      ])
    })

    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    fakeDataSource.updateOne = () => Promise.reject(errors)

    await result.current[0]({
      id: "1",
      attributes: { title: "updated-title", body: "baz-body" },
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          status: "error",
          meta: undefined,
          error: errors,
          isDone: true,
          isLoading: false,
          isRejected: true,
          isRevalidating: false,
          isStale: false,
          isSuccess: false,
        },
        undefined,
      ]),
    )

    fakeDataSource.updateOne = () =>
      Promise.resolve([
        {
          id: "1",
          __schema: "Article",
          attributes: { title: "updated-title", body: "baz-body" },
        },
      ])

    await result.current[0]({
      id: "1",
      attributes: { title: "updated-title", body: "baz-body" },
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
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
        {
          id: "1",
          __schema: "Article",
          title: "updated-title",
          body: "baz-body",
        },
      ]),
    )
  })
})
