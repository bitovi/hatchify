import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { createOne } from "./createOne"
import { fakeDataSource } from "../../mocks/testData"
import { assembler, string } from "@hatchifyjs/core"

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

  const partialSchemas = {
    Article: {
      name: "Article",
      attributes: {
        title: string(),
        body: string(),
      },
    },
  }

  const schemas = assembler(partialSchemas)

  it("should return the new record", async () => {
    createStore(["Article"])

    const result = await createOne<typeof partialSchemas, "Article">(
      fakeDataSource,
      schemas,
      "Article",
      data,
    )

    expect(result).toEqual(expected)
  })

  it("should notify subscribers", async () => {
    const store = createStore(["Article"])
    const subscriber = vi.fn()
    store.Article.subscribers.push(subscriber)
    await createOne<typeof partialSchemas, "Article">(
      fakeDataSource,
      schemas,
      "Article",
      data,
    )
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  it("should throw an error if the request fails", async () => {
    const errors = [
      {
        code: "resource-conflict-occurred",
        source: { pointer: "name" },
        status: 409,
        title: "Record with name already exists",
      },
    ]

    const errorDataSource = {
      ...fakeDataSource,
      createOne: () => Promise.reject(errors),
    }
    await expect(
      createOne<typeof partialSchemas, "Article">(
        errorDataSource,
        schemas,
        "Article",
        data,
      ),
    ).rejects.toEqual(errors)
  })

  it("should throw error if schema name is not a string", async () => {
    await expect(
      createOne<typeof partialSchemas, "Article">(
        fakeDataSource,
        schemas,
        1 as any,
        data,
      ),
    ).rejects.toThrowError()
  })
})
