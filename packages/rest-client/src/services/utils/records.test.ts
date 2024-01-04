import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import type { Record, Resource } from "../types/index.js"
import {
  keyResourcesById,
  isMissingSchema,
  resourceToRecordRelationship,
  flattenResourcesIntoRecords,
  getDisplayAttribute,
} from "./records.js"

const partialSchemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "title",
    attributes: { created: dateonly(), title: string(), important: boolean() },
    relationships: { user: belongsTo("Person") },
  },
  Person: {
    name: "Person",
    attributes: { name: string() },
    relationships: {
      todos: hasMany("Todo"),
      employer: belongsTo("Company"),
    },
  },
  Company: {
    name: "Company",
    attributes: { name: string() },
    relationships: {
      employees: hasMany("Person"),
      parentCompany: belongsTo("Company"),
    },
  },
}

const finalSchemas = assembler(partialSchemas)

describe("rest-client/utils/records", () => {
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

  describe("isMissingSchema", () => {
    it("should return true if a schema is missing", () => {
      expect(
        isMissingSchema(finalSchemas, { id: "foo-1", __schema: "Foo" }),
      ).toBe(true)

      expect(
        isMissingSchema(finalSchemas, [{ id: "missing-1", __schema: "" }]),
      ).toBe(true)
    })

    it("should return false if a schema is not missing", () => {
      expect(
        isMissingSchema(finalSchemas, { id: "todo-1", __schema: "Todo" }),
      ).toBe(false)

      expect(
        isMissingSchema(finalSchemas, [{ id: "person-1", __schema: "Person" }]),
      ).toBe(false)
    })
  })

  describe("resourceToRecordRelationship", () => {
    it("works", () => {
      const resource = {
        id: "todo-1",
        __schema: "Todo",
        attributes: {
          title: "Foo",
          important: false,
        },
      }

      const resourceById = { [resource["id"]]: resource }

      const expected = {
        id: "todo-1",
        __schema: "Todo",
        __label: "Foo",
        title: "Foo",
        important: false,
      }

      expect(
        resourceToRecordRelationship(finalSchemas, resourceById, resource),
      ).toEqual(expected)
    })
  })

  describe("flattenResourcesIntoRecords", () => {
    it("works for many resources", () => {
      const resources: Resource[] = [
        {
          id: "todo-1",
          __schema: "Todo",
          attributes: {
            title: "Code Review",
            important: false,
          },
          relationships: {
            user: { id: "person-1", __schema: "Person" },
          },
        },
        {
          id: "todo-2",
          __schema: "Todo",
          attributes: {
            title: "Refactor",
            important: true,
          },
          relationships: {
            user: { id: "person-2", __schema: "Person" },
          },
        },
      ]
      const related: Resource[] = [
        {
          id: "person-1",
          __schema: "Person",
          attributes: {
            name: "John",
          },
          relationships: {
            company: { id: "company-1", __schema: "Company" },
            todos: [
              { id: "todo-1", __schema: "Todo" },
              { id: "todo-3", __schema: "Todo" },
            ],
          },
        },
        {
          id: "person-2",
          __schema: "Person",
          attributes: {
            name: "Jane",
          },
          relationships: {
            company: { id: "company-1", __schema: "Company" },
            todos: [{ id: "todo-2", __schema: "Todo" }],
          },
        },
        {
          id: "company-1",
          __schema: "Google",
          attributes: {
            name: "Alphabet",
          },
          relationships: {
            parentCompany: { id: "company-2", __schema: "Company" },
          },
        },
        {
          id: "company-2",
          __schema: "Company",
          attributes: {
            name: "Alphabet",
          },
        },
      ]
      const expected: Record[] = [
        {
          id: "todo-1",
          __schema: "Todo",
          title: "Code Review",
          important: false,
          user: {
            id: "person-1",
            __schema: "Person",
            __label: "John",
            name: "John",
            company: {
              id: "company-1",
              __schema: "Company",
              __label: "Alphabet",
              name: "Alphabet",
              parentCompany: {
                id: "company-2",
                __schema: "Company",
                __label: "Alphabet",
                name: "Alphabet",
              },
            },
            todos: [
              {
                id: "todo-1",
                __schema: "Todo",
                __label: "todo-1",
              },
              {
                id: "todo-3",
                __schema: "Todo",
                __label: "todo-3",
              },
            ],
          },
        },
        {
          id: "todo-2",
          __schema: "Todo",
          title: "Refactor",
          important: true,
          user: {
            id: "person-2",
            __schema: "Person",
            __label: "Jane",
            name: "Jane",
            company: {
              id: "company-1",
              __schema: "Company",
              __label: "Alphabet",
              name: "Alphabet",
              parentCompany: {
                id: "company-2",
                __schema: "Company",
                __label: "Alphabet",
                name: "Alphabet",
              },
            },
            todos: [
              {
                id: "todo-2",
                __schema: "Todo",
                __label: "todo-2",
              },
            ],
          },
        },
      ]

      expect(
        flattenResourcesIntoRecords(finalSchemas, resources, related),
      ).toEqual(expected)
    })

    it("works for a single resource", () => {
      const record: Resource = {
        id: "company-1",
        __schema: "Company",
        attributes: {
          name: "Google",
        },
        relationships: {
          parentCompany: { id: "company-2", __schema: "Company" },
        },
      }

      const related: Resource[] = [
        {
          id: "company-2",
          __schema: "Company",
          attributes: {
            name: "Alphabet",
          },
        },
      ]

      const expected: Record = {
        id: "company-1",
        __schema: "Company",
        name: "Google",
        parentCompany: {
          id: "company-2",
          __schema: "Company",
          __label: "Alphabet",
          name: "Alphabet",
        },
      }

      expect(
        flattenResourcesIntoRecords(finalSchemas, record, related),
      ).toEqual(expected)
    })
  })

  describe("getDisplayAttribute", () => {
    it("works", () => {
      expect(getDisplayAttribute(finalSchemas.Todo)).toBe("title")
      expect(getDisplayAttribute(finalSchemas.Person)).toBe("name")
      expect(getDisplayAttribute(finalSchemas.Company)).toBe("name")
    })
  })
})
