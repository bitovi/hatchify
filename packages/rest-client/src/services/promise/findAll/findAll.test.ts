import { describe, it, expect, vi } from "vitest"
import { createStore } from "../../store"
import { findAll } from "./findAll"
import { fakeDataSource, schemas } from "../../mocks/testData"

describe("rest-client/services/promise/findAll", () => {
  it("should return a list of records", async () => {
    createStore(["Article"])
    const result = await findAll(fakeDataSource, schemas, "Article", {})
    const expected = [
      {
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
      },
      {
        id: "article-2",
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
        ],
      },
    ]

    expect(result).toEqual(expected)
  })

  it("should set default query.fields parameters", async () => {
    const spy = vi.spyOn(fakeDataSource, "findAll")
    await findAll(fakeDataSource, schemas, "Article", {})
    const expected = {
      fields: { Article: ["title", "body"], author: ["name"] },
      include: ["author"],
    }

    expect(spy).toHaveBeenCalledWith(schemas, "Article", expected)
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
