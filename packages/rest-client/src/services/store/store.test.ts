import { afterEach, describe, it, expect, vi } from "vitest"
import {
  createStore,
  getRecords,
  insert,
  notifySubscribers,
  remove,
} from "./store"
import { schemas } from "../mocks/testData"
import { subscribeToAll } from "../subscribe"

describe("rest-client/store", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Article", "Person"])
  })
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
      insert(schemas, "Article", [
        {
          id: "1",
          __schema: "Article",
          attributes: { title: "title-1", body: "body-1" },
        },
      ])
      insert(schemas, "Person", [
        {
          id: "1",
          __schema: "Person",
          attributes: { name: "name-1", age: 30 },
        },
      ])
      insert(schemas, "Article", [
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

      insert(schemas, "Article", [
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

  describe("getRecords", () => {
    it("should return an array of records for a given schema", () => {
      createStore(["Article", "Person"])
      insert(schemas, "Article", [
        {
          id: "article-1",
          __schema: "Article",
          attributes: { title: "title-1", body: "body-1" },
        },
      ])
      insert(schemas, "Person", [
        {
          id: "person-1",
          __schema: "Person",
          attributes: { name: "name-1", age: 30 },
        },
      ])

      expect(getRecords(schemas, "Article")).toEqual([
        {
          id: "article-1",
          __schema: "Article",
          title: "title-1",
          body: "body-1",
        },
      ])
    })

    it("should return an empty array if there are no records for a given schema", () => {
      expect(getRecords(schemas, "Tags")).toEqual([])
    })
  })

  describe("remove", () => {
    it("should remove records from the store", () => {
      createStore(["Article"])
      insert(schemas, "Article", [
        {
          id: "article-1",
          __schema: "Article",
          attributes: { title: "title-1", body: "body-1" },
        },
        {
          id: "article-2",
          __schema: "Article",
          attributes: { title: "title-2", body: "body-2" },
        },
        {
          id: "article-3",
          __schema: "Article",
          attributes: { title: "title-3", body: "body-3" },
        },
      ])

      expect(getRecords(schemas, "Article")).toEqual([
        {
          id: "article-1",
          __schema: "Article",
          title: "title-1",
          body: "body-1",
        },
        {
          id: "article-2",
          __schema: "Article",
          title: "title-2",
          body: "body-2",
        },
        {
          id: "article-3",
          __schema: "Article",
          title: "title-3",
          body: "body-3",
        },
      ])

      remove(schemas, "Article", ["article-1", "article-3"])

      expect(getRecords(schemas, "Article")).toEqual([
        {
          id: "article-2",
          __schema: "Article",
          title: "title-2",
          body: "body-2",
        },
      ])
    })
  })

  describe("nofitySubscribers", () => {
    it("should notify all subscribers if no schemaName is provided", () => {
      createStore(["Article", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      subscribeToAll("Article", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)

      notifySubscribers()

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
    })

    it("should notify all subscribers for a given schema", () => {
      createStore(["Article", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      subscribeToAll("Article", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)

      notifySubscribers("Person")

      expect(subscriber1).not.toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
    })
  })
})
