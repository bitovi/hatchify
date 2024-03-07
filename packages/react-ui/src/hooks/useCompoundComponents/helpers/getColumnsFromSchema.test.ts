import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { HatchifyPresentationDefaultDisplayComponents } from "../../../components/index.js"
import { getColumnsFromSchema } from "./index.js"

describe("hooks/useCompoundComponents/helpers/getColumnsFromSchema", () => {
  const partialSchemas = {
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
        name: string({ displayName: "Name" }),
      },
      relationships: {
        todos: hasMany("Todo"),
      },
    },
  }
  const finalSchemas = assembler(partialSchemas)

  it("works", () => {
    expect(
      getColumnsFromSchema(
        finalSchemas,
        "Todo",
        HatchifyPresentationDefaultDisplayComponents,
      ),
    ).toEqual([
      {
        headerOverride: false,
        key: "title",
        label: "Title",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
      {
        headerOverride: false,
        key: "created",
        label: "Created",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
      {
        headerOverride: false,
        key: "important",
        label: "Important",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
    ])

    expect(
      getColumnsFromSchema<typeof partialSchemas, "Todo">(
        finalSchemas,
        "Todo",
        HatchifyPresentationDefaultDisplayComponents,
        ["user"],
      ),
    ).toEqual([
      {
        headerOverride: false,
        key: "title",
        label: "Title",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
      {
        headerOverride: false,
        key: "created",
        label: "Created",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
      {
        headerOverride: false,
        key: "important",
        label: "Important",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
      {
        headerOverride: false,
        key: "user.name",
        label: "User",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
    ])
  })
})
