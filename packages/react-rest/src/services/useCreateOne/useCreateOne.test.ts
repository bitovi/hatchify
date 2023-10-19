// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/rest-client"
import type { RestClient } from "@hatchifyjs/rest-client"
import { useCreateOne } from "./useCreateOne"
import { assembler, string } from "@hatchifyjs/core"

const fakeDataSource: RestClient<any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () => Promise.resolve([[], {}]),
  findOne: () => Promise.resolve([]),
  createOne: () =>
    Promise.resolve([
      {
        id: "3",
        __schema: "Article",
        attributes: { title: "baz", body: "baz-body" },
      },
    ]),
  updateOne: () => Promise.resolve([]),
  deleteOne: () => Promise.resolve(),
}

const partialSchemas = {
  Article: {
    name: "Article",
    attributes: { title: string(), body: string() },
  },
}

const schemas = assembler(partialSchemas)

describe("react-rest/services/useCreateOne", () => {
  it("should create a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useCreateOne<typeof partialSchemas, "Article">(
        fakeDataSource,
        schemas,
        "Article",
      ),
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
      attributes: { title: "baz", body: "baz-body" },
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
          id: "3",
          __schema: "Article",
          title: "baz",
          body: "baz-body",
        },
      ]),
    )
  })

  it("should return an error if the request fails and then clear it on success", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useCreateOne<typeof partialSchemas, "Article">(
        fakeDataSource,
        schemas,
        "Article",
      ),
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

    fakeDataSource.createOne = () => Promise.reject(errors)

    await result.current[0]({ attributes: { title: "baz", body: "baz-body" } })

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

    fakeDataSource.createOne = () =>
      Promise.resolve([
        {
          id: "3",
          __schema: "Article",
          attributes: { title: "baz", body: "baz-body" },
        },
      ])

    await result.current[0]({ attributes: { title: "baz", body: "baz-body" } })

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
          id: "3",
          __schema: "Article",
          title: "baz",
          body: "baz-body",
        },
      ]),
    )
  })
})
