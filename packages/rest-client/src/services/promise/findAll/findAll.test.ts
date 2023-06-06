import { describe, it, expect } from "vitest"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../../store"
import type { Schema, Source } from "../../types"
import { findAll } from "./findAll"

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
  findAll: () => Promise.resolve(fakeData),
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

describe("rest-client/services/promise/findAll", () => {
  it("should return a list of records", async () => {
    createStore(["Article"])
    const result = await findAll(fakeDataSource, schemas, "Article", {})
    const expected = fakeData.map(convertResourceToRecord)

    expect(result).toEqual(expected)
  })

  // todo: store + can-query-logic will be implemented later
  it.skip("should insert the records into the store", async () => {
    const store = createStore(["Article"])
    await findAll(fakeDataSource, schemas, "Article", {})
    const expected = keyResourcesById(fakeData)

    expect(store.Article.data).toEqual(expected)
  })

  it("should throw an error if the request fails", async () => {
    const errorDataSource = {
      ...fakeDataSource,
      findAll: () => Promise.reject(new Error("network error")),
    }

    await expect(
      findAll(errorDataSource, schemas, "Article", {}),
    ).rejects.toThrowError("network error")
  })
})
