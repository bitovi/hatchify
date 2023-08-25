import { describe, it, expect } from "vitest"
import { createStore } from "../../store"
import { updateOne } from "./updateOne"
import { fakeDataSource, schemas } from "../../mocks/testData"

describe("rest-client/services/promise/updateOne", () => {
  const data = {
    id: "article-1",
    attributes: { title: "updated title", body: "updated body" },
  }

  const expected = {
    id: "article-1",
    __schema: "Article",
    title: "updated title",
    body: "updated body",
  }

  it("should return the new record", async () => {
    createStore(["Article"])
    const result = await updateOne(fakeDataSource, schemas, "Article", data)
    expect(result).toEqual(expected)
  })

  it("should return null if data source returns null", async () => {
    const nullDataSource = {
      ...fakeDataSource,
      updateOne: () => Promise.resolve(null),
    }

    const result = await updateOne(nullDataSource, schemas, "Article", data)
    expect(result).toEqual(null)
  })

  it.todo("should insert the record into the store")

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
      updateOne: () => Promise.reject(errors),
    }

    await expect(
      updateOne(errorDataSource, schemas, "Article", data),
    ).rejects.toEqual(errors)
  })
})
