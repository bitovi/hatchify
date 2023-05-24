// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/rest-client"
import type { Schema, Source } from "@hatchifyjs/rest-client"
import { useUpdateOne } from "./useUpdateOne"

const fakeDataSource: Source = {
  version: 0,
  getList: () => Promise.resolve([]),
  getOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () =>
    Promise.resolve([
      {
        id: "1",
        __schema: "Article",
        attributes: { title: "updated-title", body: "baz-body" },
      },
    ]),
}

const ArticleSchema = { name: "Article" } as Schema

describe("react-rest/services/useUpdateOne", () => {
  it("should update a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useUpdateOne(fakeDataSource, ArticleSchema),
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

    await result.current[0]({ title: "updated-title", body: "baz-body" })

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

  it("should return an error if the request fails", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useUpdateOne(fakeDataSource, ArticleSchema),
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

    fakeDataSource.updateOne = () =>
      Promise.reject(new Error("Something went wrong"))

    await result.current[0]({ title: "updated-title", body: "baz-body" })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
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
        undefined,
      ]),
    )
  })
})
