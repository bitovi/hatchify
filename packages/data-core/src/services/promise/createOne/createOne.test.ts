import { describe, it, expect, vi } from "vitest"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../../store"
import type { Resource, Schema, Source } from "../../types"
import { createOne } from "./createOne"

const fakeDataSource: Source = {
  version: 0,
  getList: () => Promise.resolve({ data: [] }),
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

describe("data-core/services/promise/createOne", () => {
  const data = {
    attributes: { title: "baz", body: "baz-body" },
  }
  const expected = {
    id: "3",
    __schema: "Article",
    attributes: { title: "baz", body: "baz-body" },
  }

  it("should return the new record", async () => {
    createStore(["Article"])
    const result = await createOne(fakeDataSource, ArticleSchema, data)
    expect(result).toEqual(convertResourceToRecord(expected))
  })

  it("should insert the record into the store", async () => {
    const store = createStore(["Article"])
    await createOne(fakeDataSource, ArticleSchema, data)
    expect(store.Article.data).toEqual(keyResourcesById([expected]))
  })

  it("should notify subscribers", async () => {
    const store = createStore(["Article"])
    const subscriber = vi.fn()
    store.Article.subscribers.push(subscriber)
    await createOne(fakeDataSource, ArticleSchema, data)
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it("should throw an error if the request fails", async () => {
    const errorDataSource = {
      ...fakeDataSource,
      createOne: () => Promise.reject(new Error("network error")),
    }
    await expect(
      createOne(errorDataSource, ArticleSchema, data),
    ).rejects.toThrowError("network error")
  })
})
