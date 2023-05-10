// @vitest-environment jsdom
import { describe, it, expect } from "vitest"
import { renderHook, waitFor } from "@testing-library/react"
import { createStore, convertResourceToRecord } from "data-core"
import type { Source, Subscription } from "data-core"
import { useCreateOne, useList, useOne } from "./react-hooks"

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
  getList: () => Promise.resolve({ data: fakeData }),
  getOne: () => Promise.resolve({ data: fakeData[0] }),
  createOne: () =>
    Promise.resolve({
      data: {
        id: "3",
        __schema: "Article",
        attributes: { title: "baz", body: "baz-body" },
      },
    }),
}

describe("react-rest/services/react-hooks", () => {
  describe("useList", () => {
    it("should fetch a list of records", async () => {
      createStore(["Article"])

      const { result } = renderHook(() =>
        useList(fakeDataSource, "Article", {}),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          fakeData.map(convertResourceToRecord),
          {
            status: "success",
            loading: false,
            error: undefined,
            isLoading: false,
            isDone: true,
            isRejected: false,
          },
        ]),
      )
    })

    it("should subscribe and return latest data", async () => {
      const store = createStore(["Article"])

      const { result } = renderHook(() =>
        useList(fakeDataSource, "Article", {}),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          fakeData.map(convertResourceToRecord),
          {
            status: "success",
            loading: false,
            error: undefined,
            isLoading: false,
            isDone: true,
            isRejected: false,
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

      store.Article.subscribers.forEach((subscriber: Subscription) =>
        subscriber(newFakeData.map(convertResourceToRecord)),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          newFakeData.map(convertResourceToRecord),
          {
            status: "success",
            loading: false,
            error: undefined,
            isDone: true,
            isLoading: false,
            isRejected: false,
          },
        ]),
      )
    })

    it("should return an error", async () => {
      createStore(["Article"])

      fakeDataSource.getList = () =>
        Promise.reject(new Error("Something went wrong"))

      const { result } = renderHook(() =>
        useList(fakeDataSource, "Article", {}),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          [],
          {
            status: "error",
            loading: false,
            error: new Error("Something went wrong"),
            isLoading: false,
            isDone: false,
            isRejected: true,
          },
        ]),
      )
    })
  })

  describe("useOne", () => {
    const query = { id: "1" }

    it("should fetch a record", async () => {
      createStore(["Article"])

      const { result } = renderHook(() =>
        useOne(fakeDataSource, "Article", query),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          convertResourceToRecord(fakeData[0]),
          {
            status: "success",
            loading: false,
            error: undefined,
            isLoading: false,
            isDone: true,
            isRejected: false,
          },
        ]),
      )
    })

    it.only("should subscribe and return latest data", async () => {
      const store = createStore(["Article"])

      const { result } = renderHook(() =>
        useOne(fakeDataSource, "Article", query),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          convertResourceToRecord(fakeData[0]),
          {
            status: "success",
            loading: false,
            error: undefined,
            isLoading: false,
            isDone: true,
            isRejected: false,
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

      store.Article.subscribers.forEach((subscriber: Subscription) =>
        subscriber(newFakeData.map(convertResourceToRecord)),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          convertResourceToRecord(newFakeData[0]),
          {
            status: "success",
            loading: false,
            error: undefined,
            isDone: true,
            isLoading: false,
            isRejected: false,
          },
        ]),
      )
    })

    it("should return an error", async () => {
      createStore(["Article"])

      fakeDataSource.getOne = () =>
        Promise.reject(new Error("Something went wrong"))

      const { result } = renderHook(() =>
        useOne(fakeDataSource, "Article", query),
      )

      await waitFor(() =>
        expect(result.current).toEqual([
          undefined,
          {
            status: "error",
            loading: false,
            error: new Error("Something went wrong"),
            isLoading: false,
            isDone: false,
            isRejected: true,
          },
        ]),
      )
    })
  })

  describe("useCreateOne", () => {
    it("should create a record", async () => {
      createStore(["Article"])

      const { result } = renderHook(() =>
        useCreateOne(fakeDataSource, "Article"),
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
        useCreateOne(fakeDataSource, "Article"),
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
})
