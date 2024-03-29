// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/rest-client"
import type { RestClient } from "@hatchifyjs/rest-client"
import { useDeleteOne } from "./useDeleteOne.js"
import { assembler, string } from "@hatchifyjs/core"

const fakeDataSource: RestClient<any, any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () => Promise.resolve([{ records: [], related: [] }, {}]),
  findOne: () => Promise.resolve({ record: {} as any, related: [] }),
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

describe("react-rest/services/useDeleteOne", () => {
  it("should delete a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useDeleteOne(fakeDataSource, schemas, "Article"),
    )

    await waitFor(() => {
      expect(result.current).toEqual([expect.any(Function), {}])
    })

    await result.current[0]("id")

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["id"]: {
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
        },
      ]),
    )
  })

  it("should return an error if the request fails and clear it after success", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useDeleteOne(fakeDataSource, schemas, "Article"),
    )

    await waitFor(() => {
      expect(result.current).toEqual([expect.any(Function), {}])
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
          ["id"]: {
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
        },
      ]),
    )

    fakeDataSource.deleteOne = () => Promise.resolve()

    await result.current[0]("id")

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["id"]: {
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
        },
      ]),
    )
  })

  it("should delete multiple records", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useDeleteOne(fakeDataSource, schemas, "Article"),
    )

    await waitFor(() => {
      expect(result.current).toEqual([expect.any(Function), {}])
    })

    await result.current[0]("id1")
    await result.current[0]("id2")

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["id1"]: {
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
          ["id2"]: {
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
        },
      ]),
    )
  })
})
