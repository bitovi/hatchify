// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/rest-client"
import type { Schema, Source } from "@hatchifyjs/rest-client"
import { useDeleteOne } from "./useDeleteOne"

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([[], {}]),
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

describe("react-rest/services/useDeleteOne", () => {
  it("should delete a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useDeleteOne(fakeDataSource, schemas, "Article"),
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
      ])
    })

    await result.current[0]("id")

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
      ]),
    )
  })

  it("should return an error if the request fails", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useDeleteOne(fakeDataSource, schemas, "Article"),
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
      ])
    })

    const errors = [
      {
        code: "missing-resource",
        source: {},
        status: 404,
        title: "Resource not found",
      },
    ]

    fakeDataSource.deleteOne = () => Promise.reject(errors)

    await result.current[0]("id")

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
      ]),
    )
  })
})
