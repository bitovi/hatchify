import { afterEach, describe, it, expect } from "vitest"
import {
  keyResourcesById,
  createStore,
  convertResourceToRecord,
} from "../../store"
import type { Schema, Source } from "../../types"
import { findOne } from "./findOne"

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
  findAll: () => Promise.resolve([]),
  findOne: () => Promise.resolve([fakeData[0]]),
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

describe("rest-client/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Article"])
  })

  describe("findOne", () => {
    const query = { id: "1" }

    it("should return a record", async () => {
      createStore(["Article"])
      const result = await findOne(fakeDataSource, schemas, "Article", query)
      const expected = convertResourceToRecord(fakeData[0])

      expect(result).toEqual(expected)
    })

    // todo: store + can-query-logic will be implemented later
    it.skip("should insert the record into the store", async () => {
      const store = createStore(["Article"])
      await findOne(fakeDataSource, schemas, "Article", query)
      const expected = keyResourcesById([fakeData[0]])

      expect(store.Article.data).toEqual(expected)
    })

    it("should throw an error if the request fails", async () => {
      const errorDataSource = {
        ...fakeDataSource,
        findOne: () => Promise.reject(new Error("network error")),
      }

      await expect(
        findOne(errorDataSource, schemas, "Article", query),
      ).rejects.toThrowError("network error")
    })
  })
})
