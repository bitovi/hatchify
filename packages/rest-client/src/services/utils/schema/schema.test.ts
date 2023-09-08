import { describe, expect, it } from "vitest"
import type { Schema as OldSchema } from "@hatchifyjs/hatchify-core"
import type { Schema } from "../../types"
import {
  schemaNameIsString,
  transformDataType,
  transformSchema,
} from "./schema"

describe("rest-client/services/utils/schema", () => {
  describe("transformDataType", () => {
    it("works", () => {
      expect(transformDataType("LONGTEXT")).toEqual("string")
      expect(transformDataType("STRING")).toEqual("string")
      expect(transformDataType("VARCHAR(20)")).toEqual("string")
      expect(transformDataType("DATE")).toEqual("date")
      expect(transformDataType("NOW")).toEqual("date")
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
          id: {
            allowNull: true,
            type: "string",
          },
          title: {
            allowNull: true,
            type: "string",
          },
          body: {
            allowNull: true,
            type: "string",
          },
          wordCount: {
            allowNull: true,
            type: "number",
          },
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
    it("works for object attributes", () => {
      const schema: OldSchema = {
        name: "Article",
        attributes: {
          id: { type: "UUID", allowNull: false },
          title: { type: "VARCHAR(100)", allowNull: true },
          body: { type: "LONGTEXT" },
          wordCount: { type: "INTEGER" },
          status: {
            type: "enum",
            allowNull: true,
            values: ["Published", "Reviewed", "In Progress"],
          },
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
          id: {
            allowNull: false,
            type: "string",
          },
          title: {
            allowNull: true,
            type: "string",
          },
          body: {
            allowNull: true,
            type: "string",
          },
          wordCount: {
            allowNull: true,
            type: "number",
          },
          status: {
            allowNull: true,
            type: "enum",
            values: ["Published", "Reviewed", "In Progress"],
          },
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

  describe("scehmaNameIsString", () => {
    it("works", () => {
      expect(schemaNameIsString("Foo")).toBe(true)
      expect(schemaNameIsString("Bar")).toBe(true)
      expect(schemaNameIsString(5)).toBe(false)
      expect(schemaNameIsString(true)).toBe(false)
    })
  })
})
