import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { HatchifyPresentationDefaultValueComponents } from "../../../components/index.js"
import { getColumns } from "./index.js"

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

  it("returns Columns per given schema, and given no children", () => {
    expect(
      getColumns(
        finalSchemas,
        "Todo",
        HatchifyPresentationDefaultValueComponents,
        false,
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
        false,
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
        key: "user.name",
        label: "User",
        renderData: expect.any(Function),
        renderHeader: expect.any(Function),
        sortable: true,
      },
    ])
  })

  describe("overwrite", () => {
    it("returns extra columns when overwrite is true while given an Array of JSX.elements", () => {
      const childArray = [
        {
          key: "Extra Details",
          type: { name: "Column" },
          props: { extra: "Extra Details" },
        },
      ] as JSX.Element[]

      expect(
        getColumns(
          finalSchemas,
          "Todo",
          HatchifyPresentationDefaultValueComponents,
          true,
          childArray,
        ),
      ).toEqual([
        {
          headerOverride: false,
          key: "extra-0",
          label: "",
          renderData: expect.any(Function),
          renderHeader: expect.any(Function),
          sortable: false,
        },
      ])
    })
  })
})
