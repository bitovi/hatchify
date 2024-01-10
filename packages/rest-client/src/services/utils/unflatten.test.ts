import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { unflattenData } from "./unflatten.js"

const partialSchemas = {
  Todo: {
    name: "Todo",
    attributes: { title: string(), important: boolean() },
    relationships: { user: belongsTo("Person") },
  },
  Person: {
    name: "Person",
    attributes: { name: string() },
    relationships: {
      todos: hasMany("Todo"),
    },
  },
}

const finalSchemas = assembler(partialSchemas)

describe("rest-client/utils/unflatten", () => {
  describe("unflattenData", () => {
    it("works", () => {
      expect(
        unflattenData<typeof partialSchemas, "Todo">(finalSchemas, "Todo", {
          title: "Shopping",
          important: true,
          user: { id: "1" },
        }),
      ).toEqual({
        attributes: {
          title: "Shopping",
          important: true,
        },
        relationships: {
          user: { id: "1" },
        },
      })

      expect(
        unflattenData<typeof partialSchemas, "Todo">(finalSchemas, "Todo", {
          important: true,
        }),
      ).toEqual({
        attributes: {
          important: true,
        },
        relationships: {},
      })

      expect(
        unflattenData<typeof partialSchemas, "Person">(finalSchemas, "Person", {
          name: "Jane",
        }),
      ).toEqual({
        attributes: {
          name: "Jane",
        },
        relationships: {},
      })

      expect(
        unflattenData<typeof partialSchemas, "Person">(finalSchemas, "Person", {
          todos: [{ id: "1" }, { id: "2" }],
        }),
      ).toEqual({
        attributes: {},
        relationships: {
          todos: [{ id: "1" }, { id: "2" }],
        },
      })
    })
  })
})
