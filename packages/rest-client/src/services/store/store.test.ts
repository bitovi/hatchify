import { afterEach, describe, it, expect, vi } from "vitest"
import {
  createStore,
  getRecords,
  insert,
  notifySubscribers,
  remove,
} from "./store"
import { testFinalSchemas } from "../mocks/testData"
import { subscribeToAll } from "../subscribe"

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

  describe("nofitySubscribers", () => {
    it("should notify all subscribers if no schemaName is provided", () => {
      createStore(["Todo", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)

      notifySubscribers()

      expect(subscriber1).toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
    })

    it("should notify all subscribers for a given schema", () => {
      createStore(["Todo", "Person"])
      const subscriber1 = vi.fn()
      const subscriber2 = vi.fn()

      subscribeToAll("Todo", undefined, subscriber1)
      subscribeToAll("Person", undefined, subscriber2)

      notifySubscribers("Person")

      expect(subscriber1).not.toHaveBeenCalledOnce()
      expect(subscriber2).toHaveBeenCalledOnce()
    })
  })
})
