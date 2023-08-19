import { describe, it, expect } from "vitest"
import { createStore } from "../../store"
import type { Schema, Source } from "../../types"
import { deleteOne } from "./deleteOne"

const fakeDataSource: Source = {
  version: 0,
  findAll: () => Promise.resolve([[], {}]),
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

describe("rest-client/services/promise/deleteOne", () => {
  const data = "1"
  const expected = undefined

  it("should return the new record", async () => {
    createStore(["Article"])
    const result = await deleteOne(fakeDataSource, schemas, "Article", data)
    expect(result).toEqual(expected)
  })

  it.todo("should remove the record from the store")

  it.todo("should notify subscribers")

  it("should throw an error if the request fails", async () => {
    const errors = [
      {
        code: "missing-resource",
        source: {},
        status: 404,
        title: "Resource not found",
      },
    ]

    const errorDataSource = {
      ...fakeDataSource,
      deleteOne: () => Promise.reject(errors),
    }

    await expect(
      deleteOne(errorDataSource, schemas, "Article", data),
    ).rejects.toEqual(errors)
  })
})
