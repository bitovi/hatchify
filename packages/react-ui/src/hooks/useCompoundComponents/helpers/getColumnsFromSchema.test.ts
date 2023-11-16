import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { HatchifyPresentationDefaultValueComponents } from "../../../components"
import { getColumnsFromSchema } from "."

describe("hooks/useCompoundComponents/helpers/getColumnsFromSchema", () => {
  const finalSchemas = assembler({
    Todo: {
      name: "Todo",
      attributes: {
        title: string(),
        created: dateonly(),
        important: boolean(),
      },
      relationships: {
        user: belongsTo("User"),
      },
    },
    User: {
      name: "User",
      attributes: {
        name: string(),
      },
      relationships: {
        todos: hasMany("Todo"),
      },
    },
  })

  it("works", () => {
    expect(
      getColumnsFromSchema(
        finalSchemas,
        "Todo",
        HatchifyPresentationDefaultValueComponents,
      ),
    ).toEqual([
      {
        key: "title",
        label: "Title",
        render: expect.any(Function),
        sortable: true,
      },
      {
        key: "created",
        label: "Created",
        render: expect.any(Function),
        sortable: true,
      },
      {
        key: "important",
        label: "Important",
        render: expect.any(Function),
        sortable: true,
      },
      {
        key: "user",
        label: "User",
        render: expect.any(Function),
        sortable: false,
      },
    ])
  })
})
