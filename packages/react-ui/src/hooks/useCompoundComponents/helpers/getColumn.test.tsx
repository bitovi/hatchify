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
import { getColumn, formatFieldAsLabel } from "."

describe("hooks/useCompoundComponents/helpers/getColumn", () => {
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

  it("works with attribute on base schema", () => {
    const column = getColumn({
      finalSchemas: finalSchemas,
      schemaName: "Todo",
      field: "title",
      key: "title",
      control: finalSchemas.Todo.attributes.title.control,
      compoundComponentProps: {},
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(column).toEqual({
      headerOverride: false,
      sortable: true,
      key: "title",
      label: "Title",
      renderData: expect.any(Function),
      renderHeader: expect.any(Function),
    })
  })

  it("works with compoundComponentProps", () => {
    const column = getColumn({
      finalSchemas: finalSchemas,
      schemaName: "Todo",
      field: "created",
      key: "created",
      control: finalSchemas.Todo.attributes.created.control,
      compoundComponentProps: {
        label: "CREATED",
      },
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(column).toEqual({
      headerOverride: false,
      sortable: true,
      key: "created",
      label: "CREATED",
      renderData: expect.any(Function),
      renderHeader: expect.any(Function),
    })
  })

  it("correctly sets headerOverride", () => {
    const column = getColumn({
      finalSchemas: finalSchemas,
      schemaName: "Todo",
      field: "title",
      key: "title",
      control: finalSchemas.Todo.attributes.created.control,
      compoundComponentProps: {
        renderHeaderValue: () => null,
      },
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(column).toEqual({
      headerOverride: true,
      sortable: true,
      key: "title",
      label: "Title",
      renderData: expect.any(Function),
      renderHeader: expect.any(Function),
    })
  })

  it("works with additional column", () => {
    const column = getColumn({
      finalSchemas: finalSchemas,
      schemaName: "Todo",
      field: "",
      key: "additional-0",
      control: null,
      compoundComponentProps: { label: "Additional Column" },
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(column).toEqual({
      headerOverride: false,
      sortable: false,
      key: "additional-0",
      label: "Additional Column",
      renderData: expect.any(Function),
      renderHeader: expect.any(Function),
    })
  })

  it("works on relationship", () => {
    const column = getColumn({
      finalSchemas: finalSchemas,
      schemaName: "Todo",
      key: "user",
      field: "user",
      control: null,
      compoundComponentProps: {},
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(column).toEqual({
      headerOverride: false,
      sortable: false,
      key: "user",
      label: "User",
      renderData: expect.any(Function),
      renderHeader: expect.any(Function),
    })
  })
})

describe("hooks/useCompoundComponents/helpers/formatFieldAsLabel", () => {
  it("works", () => {
    // todo: should be `Camel Case`
    expect(formatFieldAsLabel("camelCase")).toBe("CamelCase")
    expect(formatFieldAsLabel("Singluar")).toBe("Singluar")
  })
})
