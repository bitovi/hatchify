import { describe, it, expect, vi } from "vitest"
import {
  convertResourceToRecord,
  createStore,
  keyResourcesById,
  insert,
} from "./store"
import type { Resource } from "../types"

describe("data-core/store", () => {
  describe("createStore", () => {
    it("should create a ResourceStore for each schema", () => {
      expect(createStore(["Article", "Person"])).toEqual({
        Article: {
          data: {},
          subscribers: [],
        },
        Person: {
          data: {},
          subscribers: [],
        },
      })
    })
  })

  describe("insert", () => {
    it("should insert data into the store", () => {
      const store = createStore(["Article", "Person"])
      insert("Article", [
        {
          id: "1",
          __schema: "Article",
          attributes: { title: "title-1", body: "body-1" },
        },
      ])
      insert("Person", [
        {
          id: "1",
          __schema: "Person",
          attributes: { name: "name-1", age: 30 },
        },
      ])
      insert("Article", [
        {
          id: "2",
          __schema: "Article",
          attributes: { title: "title-2", body: "body-2" },
        },
        {
          id: "3",
          __schema: "Article",
          attributes: { title: "title-3", body: "body-3" },
        },
      ])

      expect(store).toEqual({
        Article: {
          data: {
            "1": {
              id: "1",
              __schema: "Article",
              attributes: { title: "title-1", body: "body-1" },
            },
            "2": {
              id: "2",
              __schema: "Article",
              attributes: { title: "title-2", body: "body-2" },
            },
            "3": {
              id: "3",
              __schema: "Article",
              attributes: { title: "title-3", body: "body-3" },
            },
          },
          subscribers: [],
        },
        Person: {
          data: {
            "1": {
              id: "1",
              __schema: "Person",
              attributes: { name: "name-1", age: 30 },
            },
          },
          subscribers: [],
        },
      })
    })

    it("should notify subscribers with Record, not Resource", () => {
      const store = createStore(["Article", "Person"])
      const subscriber = vi.fn()
      store.Article.subscribers.push(subscriber)

      insert("Article", [
        {
          id: "article-1",
          __schema: "Article",
          attributes: { title: "title-1", body: "body-1" },
        },
      ])

      expect(subscriber).toHaveBeenCalledWith([
        {
          id: "article-1",
          __schema: "Article",
          title: "title-1",
          body: "body-1",
        },
      ])
    })
  })

  describe("convertResourceToRecord", () => {
    it("should convert a resource to a record", () => {
      const resource = {
        id: "article-1",
        __schema: "Article",
        attributes: { title: "title-1", body: "body-1" },
      }

      expect(convertResourceToRecord(resource)).toEqual({
        id: "article-1",
        __schema: "Article",
        title: "title-1",
        body: "body-1",
      })
    })
  })

  describe("keyResourcesById", () => {
    it("should convert an array of resources to an object of resources keyed by id", () => {
      const resources: Resource[] = [
        { id: "1", __schema: "Entity", attributes: { name: "name-1" } },
        { id: "2", __schema: "Entity", attributes: { name: "name-2" } },
      ]

      expect(keyResourcesById(resources)).toEqual({
        "1": { id: "1", __schema: "Entity", attributes: { name: "name-1" } },
        "2": { id: "2", __schema: "Entity", attributes: { name: "name-2" } },
      })
    })
  })
})
