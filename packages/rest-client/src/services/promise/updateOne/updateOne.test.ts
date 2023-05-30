import { describe, it, expect } from "vitest"
import { createStore, convertResourceToRecord } from "../../store"
import type { Schema, Source } from "../../types"
import { updateOne } from "./updateOne"

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([]),
  findOne: () => Promise.resolve([]),
  createOne: () => Promise.resolve([]),
  updateOne: () =>
    Promise.resolve([
      {
        id: "1",
        __schema: "Article",
        attributes: { title: "updated title", body: "baz-body" },
      },
    ]),
  deleteOne: () => Promise.resolve(),
}

const ArticleSchema = {
  name: "Article",
  displayAttribute: "title",
  attributes: { title: "string", body: "string" },
} as Schema
const schemas = { Article: ArticleSchema }

describe("rest-client/services/promise/updateOne", () => {
  const data = {
    id: "1",
    attributes: { title: "updated title" },
  }
  const expected = {
    id: "1",
    __schema: "Article",
    attributes: { title: "updated title", body: "baz-body" },
  }

  it("should return the new record", async () => {
    createStore(["Article"])
    const result = await updateOne(fakeDataSource, schemas, "Article", data)
    expect(result).toEqual(convertResourceToRecord(expected))
  })

  it.todo("should insert the record into the store")

  it.todo("should notify subscribers")

  it("should throw an error if the request fails", async () => {
    const errorDataSource = {
      ...fakeDataSource,
      updateOne: () => Promise.reject(new Error("network error")),
    }
    await expect(
      updateOne(errorDataSource, schemas, "Article", data),
    ).rejects.toThrowError("network error")
  })
})
