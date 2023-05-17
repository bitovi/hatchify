import { describe, expect, it } from "vitest"
import type { Schema as OldSchema } from "@hatchifyjs/hatchify-core"
import type { Schema } from "../types"
import { transformDataType, transformSchema } from "./utils"

describe("data-core/services/types/utils", () => {
  describe("transformDataType", () => {
    it("works", () => {
      expect(transformDataType("LONGTEXT")).toEqual("string")
      expect(transformDataType("STRING")).toEqual("string")
      expect(transformDataType("VARCHAR(20)")).toEqual("string")
      expect(transformDataType("DATE")).toEqual("string")
      expect(transformDataType("NOW")).toEqual("string")
      expect(transformDataType("BOOLEAN")).toEqual("boolean")
      expect(transformDataType("BIT")).toEqual("boolean")
      expect(transformDataType("TINYINT(1)")).toEqual("boolean")
      expect(transformDataType("FLOAT(11,10)")).toEqual("number")
      expect(transformDataType("REAL")).toEqual("number")
      expect(transformDataType("DOUBLE")).toEqual("number")
      expect(transformDataType("DECIMAL")).toEqual("number")
      expect(transformDataType("JSON")).toEqual("object")
    })
  })

  describe("transformSchema", () => {
    it("works", () => {
      const schema: OldSchema = {
        name: "Article",
        attributes: {
          id: "UUID",
          title: "VARCHAR(100)",
          body: "LONGTEXT",
          wordCount: "INTEGER",
        },
        hasMany: [{ target: "Comment", options: { as: "comments" } }],
        hasOne: [{ target: "Person", options: { as: "author" } }],
        belongsTo: [{ target: "Collection", options: { as: "collections" } }],
        belongsToMany: [{ target: "Websites", options: { as: "website" } }],
      }

      const expected: Schema = {
        name: "Article",
        displayAttribute: "id",
        attributes: {
          id: "string",
          title: "string",
          body: "string",
          wordCount: "number",
        },
        relationships: {
          comments: { type: "many", schema: "Comment" },
          author: { type: "one", schema: "Person" },
          collections: { type: "one", schema: "Collection" },
          website: { type: "many", schema: "Websites" },
        },
      }

      const result = transformSchema(schema)
      expect(result).toEqual(expected)
    })
  })
})
