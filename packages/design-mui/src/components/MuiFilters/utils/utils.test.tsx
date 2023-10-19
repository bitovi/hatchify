import "@testing-library/jest-dom"
import { describe, it, expect } from "vitest"
import { getFilterableFields } from "./utils"
import { assembler, boolean, datetime, string } from "@hatchifyjs/core"

const partialSchemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: string(),
      date: datetime(),
      note: string(),
      important: boolean({ required: false }),
      // todo: v2 enums
      // status: { type: "enum", values: ["Pending", "Failed", "Complete"] },
    },
    // todo: v2 relationships
    // relationships: {
    //   user: {
    //     schema: "User",
    //     type: "one",
    //   },
    // },
  },
  User: {
    name: "User",
    displayAttribute: "name",
    attributes: {
      name: string(),
      email: string(),
      planned_date: datetime(),
      another_date: datetime(),
      // todo: v2 enums
      // user_type: { type: "enum", values: ["Admin", "User"] },
    },
    // todo: v2 relationships
    // relationships: {
    //   todo: {
    //     schema: "Todo",
    //     type: "many",
    //   },
    // },
  },
  Planner: {
    name: "Planner",
    displayAttribute: "title",
    attributes: {
      title: string(),
    },
  },
}

const finalSchemas = assembler(partialSchemas)

describe("components/MuiFilters/utils", () => {
  describe("getFilterableFields", () => {
    it("it has related fields if include is passed in with a value", () => {
      const result = getFilterableFields(finalSchemas, "Todo", ["user"])

      // boolean types are not supported yet, so important attribute is not returned
      expect(result).toEqual([
        "name",
        "date",
        "note",
        // todo: v2 enums
        // "status",
        // todo: v2 relationships
        // "user.name",
        // "user.email",
        // "user.planned_date",
        // "user.another_date",
        // "user.user_type",
      ])
    })

    it("it does not have related fields if include is empty", () => {
      const result = getFilterableFields(finalSchemas, "Todo", [])

      // boolean types are not supported yet, so important attribute is not returned
      expect(result).toEqual([
        "name",
        "date",
        "note",
        // todo: v2 enums
        // "status"
      ])
    })

    it("it adds fields that are a string instead of an object", () => {
      const result = getFilterableFields(finalSchemas, "User", [])

      expect(result).toEqual([
        "name",
        "email",
        "planned_date",
        "another_date",
        // todo: v2 enums
        // "user_type",
      ])
    })

    it("It works on schemas that do not have relationships", () => {
      const result = getFilterableFields(finalSchemas, "Planner", [])

      expect(result).toEqual(["title"])
    })
  })
})
