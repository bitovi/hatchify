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
import { getColumns } from "."

describe("hooks/useCompoundComponents/helpers/getColumns", () => {
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
        name: string(),
      },
      relationships: {
        todos: hasMany("Todo"),
      },
    },
  }
  const finalSchemas = assembler(partialSchemas)

  it("works with no children", () => {
    expect(
      getColumns(
        finalSchemas,
        "Todo",
        HatchifyPresentationDefaultValueComponents,
        [],
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
      getColumns<typeof partialSchemas, "Todo">(
        finalSchemas,
        "Todo",
        HatchifyPresentationDefaultValueComponents,
        [],
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
        key: "user",
        label: "User",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: false,
      },
    ])
  })
})
