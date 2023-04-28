import { describe, it, expect } from "vitest"
import { createStore, insert } from "./store"

describe("data/store", () => {
  describe("createStore", () => {
    it("should create a ResourceStore for each schema", () => {
      expect(createStore(["articles", "people"])).toEqual({
        articles: {
          data: {},
          subscribers: [],
        },
        people: {
          data: {},
          subscribers: [],
        },
      })
    })

    it("should insert data into the store", () => {
      const store = createStore(["articles", "people"])
      insert("articles", [
        { id: "article-1", title: "title-1", body: "body-1" },
      ])
      insert("people", [{ id: "person-1", name: "name-1", age: 30 }])
      insert("articles", [
        { id: "article-2", title: "title-2", body: "body-2" },
        { id: "article-3", title: "title-3", body: "body-3" },
      ])

      expect(store).toEqual({
        articles: {
          data: {
            "article-1": { id: "article-1", title: "title-1", body: "body-1" },
            "article-2": { id: "article-2", title: "title-2", body: "body-2" },
            "article-3": { id: "article-3", title: "title-3", body: "body-3" },
          },
          subscribers: [],
        },
        people: {
          data: {
            "person-1": { id: "person-1", name: "name-1", age: 30 },
          },
          subscribers: [],
        },
      })
    })
  })
})
