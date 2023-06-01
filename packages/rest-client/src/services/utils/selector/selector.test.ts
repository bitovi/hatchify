import { describe, expect, it } from "vitest"
import type { Schema } from "../../types"
import {
  getAttributesFromSchema,
  getFieldsFromInclude,
  getIncludeFromFields,
  getFields,
} from "./selector"

describe("rest-client/services/utils/selector", () => {
  const schemas: Record<string, Schema> = {
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

  describe("getAttributesFromSchema", () => {
    it("works", () => {
      expect(getAttributesFromSchema(schemas, "Book")).toEqual([
        "title",
        "year",
      ])
      expect(getAttributesFromSchema(schemas, "Person")).toEqual([
        "name",
        "rating",
      ])
      expect(getAttributesFromSchema(schemas, "Book", "author")).toEqual([
        "author.name",
        "author.rating",
      ])
      expect(getAttributesFromSchema(schemas, "Book", "illustrators")).toEqual([
        "illustrators.name",
        "illustrators.rating",
      ])
      expect(getAttributesFromSchema(schemas, "Person", "authored")).toEqual([
        "authored.title",
        "authored.year",
      ])
      expect(getAttributesFromSchema(schemas, "Person", "illustrated")).toEqual(
        ["illustrated.title", "illustrated.year"],
      )
    })
  })

  describe("getFieldsFromInclude", () => {
    it("works", () => {
      expect(
        getFieldsFromInclude(schemas, "Book", ["author", "illustrators"]),
      ).toEqual([
        "title",
        "year",
        "author.name",
        "author.rating",
        "illustrators.name",
        "illustrators.rating",
      ])
      expect(getFieldsFromInclude(schemas, "Book", ["author"])).toEqual([
        "title",
        "year",
        "author.name",
        "author.rating",
      ])
      expect(
        getFieldsFromInclude(schemas, "Person", ["authored", "illustrated"]),
      ).toEqual([
        "name",
        "rating",
        "authored.title",
        "authored.year",
        "illustrated.title",
        "illustrated.year",
      ])
      expect(getFieldsFromInclude(schemas, "Person", ["illustrated"])).toEqual([
        "name",
        "rating",
        "illustrated.title",
        "illustrated.year",
      ])
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

  describe("getFields", () => {
    it("works", () => {
      expect(getFields(schemas, "Book", { include: ["author"] })).toEqual([
        "title",
        "year",
        "author.name",
        "author.rating",
      ])
      expect(
        getFields(schemas, "Book", {
          fields: ["title", "author.name", "author.rating"],
        }),
      ).toEqual(["title", "author.name", "author.rating"])
      expect(getFields(schemas, "Book", { id: "5" })).toEqual(["title", "year"])
    })
  })
})
