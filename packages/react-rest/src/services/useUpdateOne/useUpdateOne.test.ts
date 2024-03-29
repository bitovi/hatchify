// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore } from "@hatchifyjs/rest-client"
import type { RestClient } from "@hatchifyjs/rest-client"
import { useUpdateOne } from "./useUpdateOne.js"
import { assembler, string } from "@hatchifyjs/core"

const fakeDataSource: RestClient<any, any> = {
  version: 0,
  completeSchemaMap: {},
  findAll: () => Promise.resolve([{ records: [], related: [] }, {}]),
  findOne: () => Promise.resolve({ record: {} as any, related: [] }),
  createOne: () => Promise.resolve({ record: {} as any, related: [] }),
  updateOne: () =>
    Promise.resolve({
      record: {
        id: "1",
        __schema: "Article",
        attributes: { title: "updated-title", body: "baz-body" },
      },
      related: [],
    }),
  deleteOne: () => Promise.resolve(),
}

const partialSchemas = {
  Article: {
    name: "Article",
    attributes: { title: string(), body: string() },
  },
}

const schemas = assembler(partialSchemas)

describe("react-rest/services/useUpdateOne", () => {
  it("should update a record", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useUpdateOne<typeof partialSchemas, "Article">(
        fakeDataSource,
        schemas,
        "Article",
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual([expect.any(Function), {}, undefined])
    })

    await result.current[0]({
      id: "1",
      title: "updated-title",
      body: "baz-body",
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["1"]: {
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
      useUpdateOne<typeof partialSchemas, "Article">(
        fakeDataSource,
        schemas,
        "Article",
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual([expect.any(Function), {}, undefined])
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
      title: "updated-title",
      body: "baz-body",
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["1"]: {
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
        undefined,
      ]),
    )

    fakeDataSource.updateOne = () =>
      Promise.resolve({
        record: {
          id: "1",
          __schema: "Article",
          attributes: { title: "updated-title", body: "baz-body" },
        },
        related: [],
      })

    await result.current[0]({
      id: "1",
      title: "updated-title",
      body: "baz-body",
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["1"]: {
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
        {
          id: "1",
          __schema: "Article",
          title: "updated-title",
          body: "baz-body",
        },
      ]),
    )
  })

  it("should update multiple records", async () => {
    createStore(["Article"])

    const { result } = renderHook(() =>
      useUpdateOne<typeof partialSchemas, "Article">(
        fakeDataSource,
        schemas,
        "Article",
      ),
    )

    await waitFor(() => {
      expect(result.current).toEqual([expect.any(Function), {}, undefined])
    })

    await result.current[0]({
      id: "1",
      title: "updated-title",
      body: "baz-body",
    })
    await result.current[0]({
      id: "2",
      title: "updated-title-2",
      body: "baz-body-2",
    })

    await waitFor(() =>
      expect(result.current).toEqual([
        expect.any(Function),
        {
          ["1"]: {
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
          ["2"]: {
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
