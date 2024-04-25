import { afterEach, describe, it, expect, vi } from "vitest"
import {
  createStore,
  getRecords,
  insert,
  notifySchema,
  notifySubscribers,
  remove,
} from "./store.js"
import { testFinalSchemas } from "../mocks/testData.js"
import { subscribeToAll } from "../subscribe/index.js"

describe("rest-client/store", () => {
  afterEach(() => {
    // reset the store's state
    createStore(["Company", "Person", "Todo"])
  })

  describe("createStore", () => {
    it("should create a ResourceStore for each schema", () => {
      expect(createStore(["Company", "Person", "Todo"])).toEqual({
        Todo: {
          data: {},
          subscribers: [],
        },
        Person: {
          data: {},
          subscribers: [],
        },
        Company: {
          data: {},
          subscribers: [],
        },
      })
    })
  })

  describe("insert", () => {
    it("should insert data into the store", () => {
      const store = createStore(["Todo", "Person"])

      insert(testFinalSchemas, "Todo", [
        {
          id: "todo-1",
          __schema: "Todo",
          attributes: { title: "title-1", important: false },
        },
      ])

      insert(testFinalSchemas, "Person", [
        {
          id: "person-1",
          __schema: "Person",
          attributes: { name: "name-1" },
        },
      ])

      insert(testFinalSchemas, "Todo", [
        {
          id: "todo-2",
          __schema: "Todo",
          attributes: { title: "title-2", important: false },
        },
        {
          id: "todo-3",
          __schema: "Todo",
          attributes: { title: "title-3", important: false },
        },
      ])

      expect(store).toEqual({
        Todo: {
          data: {
            "todo-1": {
              id: "todo-1",
              __schema: "Todo",
              attributes: { title: "title-1", important: false },
            },
            "todo-2": {
              id: "todo-2",
              __schema: "Todo",
              attributes: { title: "title-2", important: false },
            },
            "todo-3": {
              id: "todo-3",
              __schema: "Todo",
              attributes: { title: "title-3", important: false },
            },
          },
          subscribers: [],
        },
        Person: {
          data: {
            "person-1": {
              id: "person-1",
              __schema: "Person",
              attributes: { name: "name-1" },
            },
          },
          subscribers: [],
        },
        Company: {
          data: {},
          subscribers: [],
        },
      })
    })

    it("should notify subscribers with Record, not Resource", () => {
      const store = createStore(["Todo", "Person"])
      const subscriber = vi.fn()
      store.Todo.subscribers.push(subscriber)

      insert(testFinalSchemas, "Todo", [
        {
          id: "todo-1",
          __schema: "Todo",
          attributes: { title: "title-1", important: true },
        },
      ])

      expect(subscriber).toHaveBeenCalledWith([
        {
          id: "todo-1",
          __schema: "Todo",
          title: "title-1",
          important: true,
        },
      ])
    })
  })

  describe("getRecords", () => {
    it("should return an array of records for a given schema", () => {
      createStore(["Todo", "Person"])
      insert(testFinalSchemas, "Todo", [
        {
          id: "todo-1",
          __schema: "Todo",
          attributes: { title: "title-1", important: true },
        },
      ])
      insert(testFinalSchemas, "Person", [
        {
          id: "person-1",
          __schema: "Person",
          attributes: { name: "name-1" },
        },
      ])

      expect(getRecords(testFinalSchemas, "Todo")).toEqual([
        {
          id: "todo-1",
          __schema: "Todo",
          title: "title-1",
          important: true,
        },
      ])
    })

    it("should return an empty array if there are no records for a given schema", () => {
      expect(getRecords(testFinalSchemas, "Tags")).toEqual([])
    })
  })

  describe("remove", () => {
    it("should remove records from the store", () => {
      createStore(["Todo"])
      insert(testFinalSchemas, "Todo", [
        {
          id: "todo-1",
          __schema: "Todo",
          attributes: { title: "title-1", important: false },
        },
        {
          id: "todo-2",
          __schema: "Todo",
          attributes: { title: "title-2", important: false },
        },
        {
          id: "todo-3",
          __schema: "Todo",
          attributes: { title: "title-3", important: false },
        },
      ])

      expect(getRecords(testFinalSchemas, "Todo")).toEqual([
        {
          id: "todo-1",
          __schema: "Todo",
          title: "title-1",
          important: false,
        },
        {
          id: "todo-2",
          __schema: "Todo",
          title: "title-2",
          important: false,
        },
        {
          id: "todo-3",
          __schema: "Todo",
          title: "title-3",
          important: false,
        },
      ])

      remove(testFinalSchemas, "Todo", ["todo-1", "todo-3"])

      expect(getRecords(testFinalSchemas, "Todo")).toEqual([
        {
          id: "todo-2",
          __schema: "Todo",
          title: "title-2",
          important: false,
        },
      ])
    })
  })

  describe("notifySchema", () => {
    it("should notify all subscribers for a given schema", () => {
      createStore(["Todo", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()
      const subscriber3 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Todo", undefined, subscriber2)
      subscribeToAll("Person", undefined, subscriber3)

      notifySchema("Todo")

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
      expect(subscriber3).not.toHaveBeenCalledOnce()
    })
  })

  describe("notifySubscribers", () => {
    it("should notify all subscribers if notify is not provided", () => {
      createStore(["Todo", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()
      const subscriber3 = vi.fn()
      const subscriber4 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Todo", undefined, subscriber2)
      subscribeToAll("Person", undefined, subscriber3)
      subscribeToAll("Person", undefined, subscriber4)

      notifySubscribers("Todo")

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
      expect(subscriber3).toHaveBeenCalledOnce()
      expect(subscriber4).toHaveBeenCalledOnce()
    })

    it("should notify all subscribers if notify is true", () => {
      createStore(["Todo", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)

      notifySubscribers("Todo", true)

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
    })

    it("should only notify subscribers for the given schema if notify is false", () => {
      createStore(["Todo", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)

      notifySubscribers("Todo", false)

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).not.toHaveBeenCalledOnce()
    })

    it("should only notify subscribers specified by the notify option and the given schema", () => {
      createStore(["Todo", "Person", "Company"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()
      const subscriber3 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)
      subscribeToAll("Company", undefined, subscriber3)

      notifySubscribers("Todo", ["Company"])

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).not.toHaveBeenCalledOnce()
      expect(subscriber3).toHaveBeenCalledOnce()
    })

    it("should only notify a subscriber once, even if notify contains duplicates", () => {
      createStore(["Todo", "Person", "Company"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()
      const subscriber3 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)
      subscribeToAll("Company", undefined, subscriber3)

      notifySubscribers("Todo", ["Company", "Company", "Company"])

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).not.toHaveBeenCalledOnce()
      expect(subscriber3).toHaveBeenCalledOnce()
    })
  })
})
