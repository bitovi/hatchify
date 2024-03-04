import { describe, it, expect, vi } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { HatchifyPresentationDefaultValueComponents } from "../../../components/index.js"
import { getColumn, formatFieldAsLabel } from "./index.js"

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

  it("returns a column given an attribute on base schema", () => {
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

  it("return a column when given compoundComponentProps", () => {
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

  describe("correctly sets renderDataValue", () => {
    const mockDataFunction = vi
      .fn()
      .mockImplementation(({ args, value }) => "Data")

    const mockDataComponent = (header: string) => {
      return <h1> {header} </h1>
    }

    it("for when 'renderData' is given", () => {
      const column = getColumn({
        finalSchemas: finalSchemas,
        schemaName: "Todo",
        field: "title",
        key: "title",
        control: finalSchemas.Todo.attributes.created.control,
        compoundComponentProps: {
          renderData: mockDataFunction,
        },
        defaultValueComponents: HatchifyPresentationDefaultValueComponents,
      })

      expect(column.renderData("string" as any)).toBe("Data")
    })

    it("for when 'renderDataValue' is given", () => {
      const column = getColumn({
        finalSchemas: finalSchemas,
        schemaName: "Todo",
        field: "title",
        key: "title",
        control: finalSchemas.Todo.attributes.created.control,
        compoundComponentProps: {
          renderDataValue: mockDataFunction,
        },
        defaultValueComponents: HatchifyPresentationDefaultValueComponents,
      })

      expect(
        column.renderData({ record: { title: "something" } as any } as any),
      ).toBe("Data")
    })

    it("for when 'DataValueComponent' is given, renders without error", () => {
      const column = getColumn({
        finalSchemas: finalSchemas,
        schemaName: "Todo",
        field: "title",
        key: "title",
        control: finalSchemas.Todo.attributes.created.control,
        compoundComponentProps: {
          DataValueComponent: mockDataComponent,
        },
        defaultValueComponents: HatchifyPresentationDefaultValueComponents,
      })

      column.renderData({ record: { title: "something" } as any } as any)
    })
  })
  describe("correctly sets headerOverride", () => {
    const mockHeaderFunction = vi
      .fn()
      .mockImplementation((args: unknown) => "Overidden Header")

    const mockComponent = (header: string) => {
      return <h1> {header} </h1>
    }

    it("for when renderHeaderValue is null", () => {
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

    it("for when renderHeaderValue is given render function", () => {
      const column = getColumn({
        finalSchemas: finalSchemas,
        schemaName: "Todo",
        field: "title",
        key: "title",
        control: finalSchemas.Todo.attributes.created.control,
        compoundComponentProps: {
          renderHeaderValue: mockHeaderFunction,
        },
        defaultValueComponents: HatchifyPresentationDefaultValueComponents,
      })

      column.renderHeader("string" as any)

      expect(mockHeaderFunction).toBeCalled()

      // expect(column).toEqual({
      //   headerOverride: true,
      //   sortable: true,
      //   key: "title",
      //   label: "Title",
      //   renderData: expect.any(Function),
      //   renderHeader: () => expect.any(Function),
      // })
    })

    it("for when HeaderValueComponent is given a component", () => {
      const column = getColumn({
        finalSchemas: finalSchemas,
        schemaName: "Todo",
        field: "title",
        key: "title",
        control: finalSchemas.Todo.attributes.created.control,
        compoundComponentProps: {
          HeaderValueComponent: mockComponent,
        },
        defaultValueComponents: HatchifyPresentationDefaultValueComponents,
      })

      column.renderHeader("string" as any)

      expect(mockHeaderFunction).toBeCalled()
    })
  })

  it("returns Column when given an additional column prop", () => {
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

  it("returns a column when given a relationship", () => {
    const column = getColumn({
      finalSchemas: finalSchemas,
      schemaName: "Todo",
      key: "user.name",
      field: "user",
      sortable: true,
      control: null,
      compoundComponentProps: {},
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(column).toEqual({
      headerOverride: false,
      sortable: true,
      key: "user.name",
      label: "User",
      renderData: expect.any(Function),
      renderHeader: expect.any(Function),
    })
  })
})

describe("hooks/useCompoundComponents/helpers/formatFieldAsLabel", () => {
  it("returns field names as Title Case for labeling", () => {
    expect(formatFieldAsLabel("camelCase")).toBe("Camel Case")
    expect(formatFieldAsLabel("Singluar")).toBe("Singluar")
  })
})
