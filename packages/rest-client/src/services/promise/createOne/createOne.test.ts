import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { createOne } from "./createOne"
import { fakeDataSource, schemas } from "../../mocks/testData"

describe("rest-client/services/promise/createOne", () => {
  const data = {
    __schema: "Article",
    attributes: { title: "baz", body: "baz-body" },
  }

  const expected = {
    id: "article-3",
    __schema: "Article",
    title: "baz",
    body: "baz-body",
  }

  it("should return the new record", async () => {
    createStore(["Article"])

    const result = await createOne(fakeDataSource, schemas, "Article", data)

    expect(result).toEqual(expected)
  })

  it("should notify subscribers", async () => {
    const store = createStore(["Article"])
    const subscriber = vi.fn()
    store.Article.subscribers.push(subscriber)
    await createOne(fakeDataSource, schemas, "Article", data)
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it("should throw an error if the request fails", async () => {
    const errorDataSource = {
      ...fakeDataSource,
      createOne: () => Promise.reject(new Error("network error")),
    }
    await expect(
      createOne(errorDataSource, schemas, "Article", data),
    ).rejects.toThrowError("network error")
  })
})
