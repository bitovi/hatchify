import { describe, expect, it } from "vitest"
import type { PartialSchema } from "@hatchifyjs/core"
import {
  assembler,
  belongsTo,
  boolean,
  datetime,
  hasMany,
  integer,
  string,
} from "@hatchifyjs/core"
import {
  getAttributesFromSchema,
  getFieldsFromInclude,
  getIncludeFromFields,
  getFields,
  getToOneRelationshipsAsFields,
  getToOneRelationshipsAsInclude,
  getInclude,
} from "./selector"

const partialTodoUserSchemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: string(),
      important: boolean(),
      dueDate: datetime(),
    },
    relationships: {
      user: belongsTo(),
    },
  },
  User: {
    name: "User",
    displayAttribute: "name",
    attributes: {
      name: string(),
      email: string(),
    },
    relationships: {
      todos: hasMany(),
    },
  },
} satisfies Record<string, PartialSchema>

const partialBookAuthorSchemas = {
  Book: {
    name: "Book",
    displayAttribute: "title",
    attributes: {
      title: string(),
      year: integer(),
    },
    relationships: {
      author: belongsTo("Person"),
      illustrators: hasMany("Person"),
    },
  },
  Person: {
    name: "Person",
    displayAttribute: "name",
    attributes: {
      name: string(),
      rating: integer(),
    },
    relationships: {
      authored: hasMany("Book"),
      illustrated: hasMany("Book"),
    },
  },
} satisfies Record<string, PartialSchema>

const todoUserSchemas = assembler(partialTodoUserSchemas)
const bookAuthorSchemas = assembler(partialBookAuthorSchemas)

describe("rest-client/services/utils/selector", () => {
  describe("getAttributesFromSchema", () => {
    it("works", () => {
      expect(getAttributesFromSchema(bookAuthorSchemas, "Book")).toEqual({
        Book: ["title", "year"],
      })

      expect(getAttributesFromSchema(bookAuthorSchemas, "Person")).toEqual({
        Person: ["name", "rating"],
      })

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Book", "author"),
      ).toEqual({ author: ["name", "rating"] })

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Book", "illustrators"),
      ).toEqual({ illustrators: ["name", "rating"] })

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Person", "authored"),
      ).toEqual({ authored: ["title", "year"] })

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Person", "illustrated"),
      ).toEqual({ illustrated: ["title", "year"] })
    })
  })

  describe("getFieldsFromInclude", () => {
    it("works", () => {
      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Book", [
          "author",
          "illustrators",
        ]),
      ).toEqual({
        Book: ["title", "year"],
        author: ["name", "rating"],
        illustrators: ["name", "rating"],
      })

      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Book", ["author"]),
      ).toEqual({
        Book: ["title", "year"],
        author: ["name", "rating"],
      })

      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Person", [
          "authored",
          "illustrated",
        ]),
      ).toEqual({
        Person: ["name", "rating"],
        authored: ["title", "year"],
        illustrated: ["title", "year"],
      })

      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Person", ["illustrated"]),
      ).toEqual({
        Person: ["name", "rating"],
        illustrated: ["title", "year"],
      })
    })
  })

  describe("getIncludeFromFields", () => {
    it("works", () => {
      expect(getIncludeFromFields({ Book: ["title", "year"] }, "Book")).toEqual(
        [],
      )

      expect(
        getIncludeFromFields(
          { Book: ["name"], author: ["author"], illustrators: ["name"] },
          "Book",
        ),
      ).toEqual(["author", "illustrators"])

      expect(
        getIncludeFromFields(
          {
            Book: ["name", "rating"],
            illustrated: ["title"],
          },
          "Book",
        ),
      ).toEqual(["illustrated"])
    })
  })

  describe("getToOneRelationshipsAsFields", () => {
    it("works", () => {
      expect(getToOneRelationshipsAsFields(todoUserSchemas, "Todo")).toEqual({
        user: ["name"],
      })

      expect(getToOneRelationshipsAsFields(todoUserSchemas, "User")).toEqual({})
    })
  })

  describe("getToOneRelationshipsAsInclude", () => {
    it("works", () => {
      expect(getToOneRelationshipsAsInclude(todoUserSchemas, "Todo")).toEqual([
        "user",
      ])

      expect(getToOneRelationshipsAsInclude(todoUserSchemas, "User")).toEqual(
        [],
      )

      expect(getToOneRelationshipsAsInclude(bookAuthorSchemas, "Book")).toEqual(
        ["author"],
      )

      expect(
        getToOneRelationshipsAsInclude(bookAuthorSchemas, "Person"),
      ).toEqual([])
    })
  })

  describe("getFields", () => {
    it("works", () => {
      expect(
        getFields(bookAuthorSchemas, "Book", { include: ["author"] }),
      ).toEqual({ Book: ["title", "year"], author: ["name", "rating"] })

      expect(
        getFields(bookAuthorSchemas, "Book", {
          fields: { Book: ["title"], author: ["name", "rating"] },
        }),
      ).toEqual({ Book: ["title"], author: ["name", "rating"] })

      expect(getFields(bookAuthorSchemas, "Book", { id: "5" })).toEqual({
        Book: ["title", "year"],
        author: ["name"],
      })
    })
  })

  describe("getInclude", () => {
    it("works", () => {
      expect(
        getInclude(bookAuthorSchemas, "Book", { include: ["author"] }),
      ).toEqual(["author"])

      expect(
        getInclude(bookAuthorSchemas, "Book", {
          fields: { Book: ["title"], author: ["name", "rating"] },
        }),
      ).toEqual(["author"])

      expect(getInclude(bookAuthorSchemas, "Book", { id: "5" })).toEqual([
        "author",
      ])

      expect(getInclude(todoUserSchemas, "Todo", {})).toEqual(["user"])

      expect(getInclude(todoUserSchemas, "User", {})).toEqual([])
    })
  })
})
