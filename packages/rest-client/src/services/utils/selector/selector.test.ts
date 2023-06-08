import { describe, expect, it } from "vitest"
import type { Schema } from "../../types"
import {
  getAttributesFromSchema,
  getFieldsFromInclude,
  getIncludeFromFields,
  getFields,
  getToOneRelationshipsAsFields,
  getToOneRelationshipsAsInclude,
  getInclude,
} from "./selector"

const Todo: Schema = {
  name: "Todo",
  displayAttribute: "name",
  attributes: {
    name: "string",
    important: "boolean",
    due_date: "date",
  },
  relationships: {
    user: {
      type: "one",
      schema: "User",
    },
  },
}

const User: Schema = {
  name: "User",
  displayAttribute: "name",
  attributes: {
    name: "string",
    email: "string",
  },
  relationships: {
    todos: {
      type: "many",
      schema: "Todo",
    },
  },
}

const todoUserSchemas = { Todo, User }

const bookAuthorSchemas: Record<string, Schema> = {
  Book: {
    name: "Book",
    displayAttribute: "title",
    attributes: {
      title: "string",
      year: "number",
    },
    relationships: {
      author: {
        type: "one",
        schema: "Person",
      },
      illustrators: {
        type: "many",
        schema: "Person",
      },
    },
  },
  Person: {
    name: "Person",
    displayAttribute: "name",
    attributes: {
      name: "string",
      rating: "number",
    },
    relationships: {
      authored: {
        type: "many",
        schema: "Book",
      },
      illustrated: {
        type: "many",
        schema: "Book",
      },
    },
  },
}

describe("rest-client/services/utils/selector", () => {
  describe("getAttributesFromSchema", () => {
    it("works", () => {
      expect(getAttributesFromSchema(bookAuthorSchemas, "Book")).toEqual([
        "title",
        "year",
      ])

      expect(getAttributesFromSchema(bookAuthorSchemas, "Person")).toEqual([
        "name",
        "rating",
      ])

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Book", "author"),
      ).toEqual(["author.name", "author.rating"])

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Book", "illustrators"),
      ).toEqual(["illustrators.name", "illustrators.rating"])

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Person", "authored"),
      ).toEqual(["authored.title", "authored.year"])

      expect(
        getAttributesFromSchema(bookAuthorSchemas, "Person", "illustrated"),
      ).toEqual(["illustrated.title", "illustrated.year"])
    })
  })

  describe("getFieldsFromInclude", () => {
    it("works", () => {
      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Book", [
          "author",
          "illustrators",
        ]),
      ).toEqual([
        "title",
        "year",
        "author.name",
        "author.rating",
        "illustrators.name",
        "illustrators.rating",
      ])

      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Book", ["author"]),
      ).toEqual(["title", "year", "author.name", "author.rating"])

      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Person", [
          "authored",
          "illustrated",
        ]),
      ).toEqual([
        "name",
        "rating",
        "authored.title",
        "authored.year",
        "illustrated.title",
        "illustrated.year",
      ])

      expect(
        getFieldsFromInclude(bookAuthorSchemas, "Person", ["illustrated"]),
      ).toEqual(["name", "rating", "illustrated.title", "illustrated.year"])
    })
  })

  describe("getIncludeFromFields", () => {
    it("works", () => {
      expect(getIncludeFromFields(["title", "year"])).toEqual([])

      expect(
        getIncludeFromFields(["name", "author.rating", "illustrators.name"]),
      ).toEqual(["author", "illustrators"])

      expect(
        getIncludeFromFields(["name", "rating", "illustrated.title"]),
      ).toEqual(["illustrated"])
    })
  })

  describe("getToOneRelationshipsAsFields", () => {
    it("works", () => {
      expect(getToOneRelationshipsAsFields(todoUserSchemas, "Todo")).toEqual([
        "user.name",
      ])

      expect(getToOneRelationshipsAsFields(todoUserSchemas, "User")).toEqual([])
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
      ).toEqual(["title", "year", "author.name", "author.rating"])

      expect(
        getFields(bookAuthorSchemas, "Book", {
          fields: ["title", "author.name", "author.rating"],
        }),
      ).toEqual(["title", "author.name", "author.rating"])

      expect(getFields(bookAuthorSchemas, "Book", { id: "5" })).toEqual([
        "title",
        "year",
        "author.name",
      ])
    })
  })

  describe("getInclude", () => {
    it("works", () => {
      expect(
        getInclude(bookAuthorSchemas, "Book", { include: ["author"] }),
      ).toEqual(["author"])

      expect(
        getInclude(bookAuthorSchemas, "Book", {
          fields: ["title", "author.name", "author.rating"],
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
