import { afterEach, describe, it, expect, vi } from "vitest"
import {
  createStore,
  getRecords,
  keyResourcesById,
  insert,
  remove,
  flattenResourcesIntoRecords,
} from "./store"
import { testData } from "../mocks/testData"
import type { Resource } from "../types"

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

  describe("getRecords", () => {
    it("should return an array of records for a given schema", () => {
      createStore(["Article", "Person"])
      insert("Article", [
        {
          id: "article-1",
          __schema: "Article",
          attributes: { title: "title-1", body: "body-1" },
        },
      ])
      insert("Person", [
        {
          id: "person-1",
          __schema: "Person",
          attributes: { name: "name-1", age: 30 },
        },
      ])

      expect(getRecords("Article")).toEqual([
        {
          id: "article-1",
          __schema: "Article",
          title: "title-1",
          body: "body-1",
        },
      ])
    })

    it("should return an empty array if there are no records for a given schema", () => {
      expect(getRecords("Tags")).toEqual([])
    })
  })

  describe("remove", () => {
    it("should remove records from the store", () => {
      createStore(["Article"])
      insert("Article", [
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

      expect(getRecords("Article")).toEqual([
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

      remove("Article", ["article-1", "article-3"])

      expect(getRecords("Article")).toEqual([
        {
          id: "article-2",
          __schema: "Article",
          title: "title-2",
          body: "body-2",
        },
      ])
    })
  })

  describe("flattenResourcesIntoRecords", () => {
    it("works for many resources", () => {
      const expected = [
        {
          id: "article-1",
          __schema: "Article",
          title: "foo",
          body: "foo-body",
          author: { id: "person-1", __schema: "Person", name: "foo" },
          tags: [
            { id: "tag-1", __schema: "Tag", title: "tag-1" },
            { id: "tag-2", __schema: "Tag", title: "tag-2" },
          ],
        },
        {
          id: "article-2",
          __schema: "Article",
          title: "foo",
          body: "foo-body",
          author: { id: "person-1", __schema: "Person", name: "foo" },
          tags: [{ id: "tag-1", __schema: "Tag", title: "tag-1" }],
        },
      ]

      expect(flattenResourcesIntoRecords(testData, "Article")).toEqual(expected)
    })

    it("works for a single resource", () => {
      const expected = {
        id: "article-2",
        __schema: "Article",
        title: "foo",
        body: "foo-body",
        author: { id: "person-1", __schema: "Person", name: "foo" },
        tags: [{ id: "tag-1", __schema: "Tag", title: "tag-1" }],
      }

      expect(
        flattenResourcesIntoRecords(testData, "Article", "article-2"),
      ).toEqual(expected)
    })
  })
})
