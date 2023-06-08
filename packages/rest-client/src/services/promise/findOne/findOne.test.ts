import { afterEach, describe, it, expect } from "vitest"
import { createStore } from "../../store"
import { findOne } from "./findOne"
import { fakeDataSource, schemas } from "../../mocks/testData"

describe("rest-client/promise", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Article"])
  })

  describe("findOne", () => {
    const query = { id: "article-1" }

    it("should return a record", async () => {
      createStore(["Article"])
      const result = await findOne(fakeDataSource, schemas, "Article", query)

      const expected = {
        id: "article-1",
        __schema: "Article",
        title: "foo",
        body: "foo-body",
        author: {
          id: "person-1",
          __schema: "Person",
          __label: "foo",
          name: "foo",
        },
        tags: [
          { id: "tag-1", __schema: "Tag", __label: "tag-1", title: "tag-1" },
          { id: "tag-2", __schema: "Tag", __label: "tag-2", title: "tag-2" },
        ],
      }

      expect(result).toEqual(expected)
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
