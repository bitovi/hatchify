// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/data-core"
import type { Resource, Schema, Source } from "@hatchifyjs/data-core"
import { useCreateOne } from "./useCreateOne"

const fakeDataSource: Source = {
  version: 0,
  getList: () => Promise.resolve({ data: [] as Resource[] }),
  getOne: () => Promise.resolve({ data: {} as Resource }),
  createOne: () =>
    Promise.resolve({
      data: {
        id: "3",
        __schema: "Article",
        attributes: { title: "baz", body: "baz-body" },
      },
    }),
}

const ArticleSchema = { name: "Article" } as Schema

describe("react-rest/services/useCreateOne", () => {
  it("should create a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useCreateOne(fakeDataSource, ArticleSchema),
    )

    await waitFor(() => {
      expect(result.current).toEqual([
        expect.any(Function),
        {
          status: "success",
          error: undefined,
          isLoading: false,
          isDone: true,
          isRejected: false,
        },
        undefined,
      ])
    })

    await result.current[0]({ title: "baz", body: "baz-body" })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          status: "success",
          error: undefined,
          isLoading: false,
          isDone: true,
          isRejected: false,
        },
        {
          id: "3",
          __schema: "Article",
          title: "baz",
          body: "baz-body",
        },
      ]),
    )
  })

  it("should return an error if the request fails", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useCreateOne(fakeDataSource, ArticleSchema),
    )

    await waitFor(() => {
      expect(result.current).toEqual([
        expect.any(Function),
        {
          status: "success",
          error: undefined,
          isLoading: false,
          isDone: true,
          isRejected: false,
        },
        undefined,
      ])
    })

    fakeDataSource.createOne = () =>
      Promise.reject(new Error("Something went wrong"))

    await result.current[0]({ title: "baz", body: "baz-body" })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          status: "error",
          error: new Error("Something went wrong"),
          isLoading: false,
          isDone: false,
          isRejected: true,
        },
        undefined,
      ]),
    )
  })
})
