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
