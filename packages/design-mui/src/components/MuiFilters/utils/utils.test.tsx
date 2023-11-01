import "@testing-library/jest-dom"
import { describe, it, expect } from "vitest"
import { getFilterableFields } from "./utils"
import {
  assembler,
  belongsTo,
  boolean,
  datetime,
  enumerate,
  hasMany,
  string,
} from "@hatchifyjs/core"

const partialSchemas = {
  Todo: {
    name: "Todo",
    displayAttribute: "name",
    attributes: {
      name: string(),
      date: datetime(),
      note: string(),
      important: boolean({ required: false }),
      status: enumerate({ values: ["Pending", "Failed", "Complete"] }),
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
      planned_date: datetime(),
      another_date: datetime(),
      user_type: enumerate({ values: ["Admin", "User"] }),
    },
    relationships: {
      todo: hasMany(),
    },
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
        "status",
        "user.name",
        "user.email",
        "user.planned_date",
        "user.another_date",
        "user.user_type",
      ])
    })

    it("it does not have related fields if include is empty", () => {
      const result = getFilterableFields(finalSchemas, "Todo", [])

      // boolean types are not supported yet, so important attribute is not returned
      expect(result).toEqual(["name", "date", "note", "status"])
    })

    it("it adds fields that are a string instead of an object", () => {
      const result = getFilterableFields(finalSchemas, "User", [])

      expect(result).toEqual([
        "name",
        "email",
        "planned_date",
        "another_date",
        "user_type",
      ])
    })

    it("It works on schemas that do not have relationships", () => {
      const result = getFilterableFields(finalSchemas, "Planner", [])

      expect(result).toEqual(["title"])
    })
  })
})
