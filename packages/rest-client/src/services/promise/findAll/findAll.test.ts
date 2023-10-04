import { assembler, integer } from "@hatchifyjs/core"
import { describe, it, expect } from "vitest"
import { createStore } from "../../store"
import { findAll } from "./findAll"
import { fakeDataSource } from "../../mocks/testData"

const finalSchemas = assembler({
  Article: {
    name: "Article",
    attributes: {
      views: integer(),
    },
  },
  Person: {
    name: "Person",
    attributes: {
      age: integer(),
    },
  },
  Tag: {
    name: "Tag",
    attributes: {
      views: integer(),
    },
  },
})

describe("rest-client/services/promise/findAll", () => {
  it("should return a list of records", async () => {
    createStore(["Article"])
    const result = await findAll(fakeDataSource, finalSchemas, "Article", {})
    const expected = [
      {
        id: "article-1",
        __schema: "Article",
        title: "foo",
        body: "foo-body",
        // todo: relationships not ready for v2 yet
        // author: {
        //   id: "person-1",
        //   __schema: "Person",
        //   __label: "foo",
        //   name: "foo",
        // },
        // tags: [
        // { id: "tag-1", __schema: "Tag", __label: "tag-1", title: "tag-1" },
        // { id: "tag-2", __schema: "Tag", __label: "tag-2", title: "tag-2" },
        // ],
      },
      {
        id: "article-2",
        __schema: "Article",
        title: "foo",
        body: "foo-body",
        // author: {
        // id: "person-1",
        // __schema: "Person",
        // __label: "foo",
        // name: "foo",
        // },
        // tags: [
        // { id: "tag-1", __schema: "Tag", __label: "tag-1", title: "tag-1" },
        // ],
      },
    ]

    expect(result[0]).toEqual(expected)
    expect(result[1]).toEqual({ unpaginatedCount: 2 })
  })

  it("should throw an error if the request fails", async () => {
    const errors = [
      {
        code: "invalid-query",
        source: {},
        status: 422,
        title: "Invalid query",
      },
    ]

    const errorDataSource = {
      ...fakeDataSource,
      findAll: () => Promise.reject(errors),
    }

    await expect(
      findAll(errorDataSource, finalSchemas, "Article", {}),
    ).rejects.toEqual(errors)
  })
})
