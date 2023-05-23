import { describe, it, expect } from "vitest"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../../store"
import type { Schema, Source } from "../../types"
import { getList } from "./getList"

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
  getList: () => Promise.resolve(fakeData),
  getOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
}

const ArticleSchema = { name: "Article" } as Schema

describe("rest-client/services/promise/getList", () => {
  it("should return a list of records", async () => {
    createStore(["Article"])
    const result = await getList(fakeDataSource, ArticleSchema, {})
    const expected = fakeData.map(convertResourceToRecord)

    expect(result).toEqual(expected)
  })

  it("should insert the records into the store", async () => {
    const store = createStore(["Article"])
    await getList(fakeDataSource, ArticleSchema, {})
    const expected = keyResourcesById(fakeData)

    expect(store.Article.data).toEqual(expected)
  })

  it("should throw an error if the request fails", async () => {
    const errorDataSource = {
      ...fakeDataSource,
      getList: () => Promise.reject(new Error("network error")),
    }

    await expect(
      getList(errorDataSource, ArticleSchema, {}),
    ).rejects.toThrowError("network error")
  })
})
