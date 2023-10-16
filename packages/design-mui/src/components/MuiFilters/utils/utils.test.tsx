import type { Schemas } from "@hatchifyjs/rest-client"
import "@testing-library/jest-dom"
import { describe, it, expect } from "vitest"
import { getFilterableFields } from "./utils"

const schemas: Schemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: { type: "string", allowNull: true },
      date: "date",
      note: "string",
      important: { type: "boolean", allowNull: true },
      status: { type: "enum", values: ["Pending", "Failed", "Complete"] },
    },
    relationships: {
      user: {
        schema: "User",
        type: "one",
      },
    },
  },
  User: {
    name: "User",
    displayAttribute: "name",
    attributes: {
      name: { type: "string" },
      email: "string",
      planned_date: { type: "date" },
      another_date: "date",
      user_type: { type: "enum", values: ["Admin", "User"] },
    },
    relationships: {
      todo: {
        schema: "Todo",
        type: "many",
      },
    },
  },
  Planner: {
    name: "Planner",
    displayAttribute: "title",
    attributes: {
      title: "string",
    },
  },
}

describe("components/MuiFilters/utils", () => {
  describe("getFilterableFields", () => {
    it("it has related fields if include is passed in with a value", () => {
      const result = getFilterableFields(schemas, "Todo", ["user"])

      // boolean types are not supported yet, so important attribute is not returned
      expect(result).toEqual([
        "name",
        "date",
        "note",
        "status",
        "user.name",
        "user.email",
        "user.planned_date",
        "user.another_date",
        "user.user_type",
      ])
    })

    it("it does not have related fields if include is empty", () => {
      const result = getFilterableFields(schemas, "Todo", [])

      // boolean types are not supported yet, so important attribute is not returned
      expect(result).toEqual(["name", "date", "note", "status"])
    })

    it("it adds fields that are a string instead of an object", () => {
      const result = getFilterableFields(schemas, "User", [])

      expect(result).toEqual([
        "name",
        "email",
        "planned_date",
        "another_date",
        "user_type",
      ])
    })

    it("It works on schemas that do not have relationships", () => {
      const result = getFilterableFields(schemas, "Planner", [])

      expect(result).toEqual(["title"])
    })
  })
})
