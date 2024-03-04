import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { getDefaultDataRender } from "./index.js"
import { HatchifyPresentationDefaultValueComponents } from "../../../components/index.js"

/* eslint-disable testing-library/render-result-naming-convention */
describe("hooks/useCompoundComponents/helpers/getDefaultDataRender", () => {
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

  it("when given a record for a matching attribute, properly renders it in column", () => {
    const columnRenderFn = getDefaultDataRender({
      finalSchemas,
      schemaName: "Todo",
      control: finalSchemas.Todo.attributes.title.control,
      field: "title",
      isRelationship: false,
      isAdditional: false,
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })
    const record = { record: { id: "1", title: "test" } }

    // @ts-ignore
    expect(columnRenderFn(record).props.value).toEqual("test")
  })

  it("when no attribute matches, renders and empty string in column", () => {
    const columnRenderFn = getDefaultDataRender({
      finalSchemas,
      schemaName: "Todo",
      control: finalSchemas.Todo.attributes.title.control,
      field: "title",
      isRelationship: false,
      isAdditional: false,
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })
    const record = { record: { id: "1" } }

    // @ts-ignore
    expect(columnRenderFn(record).props.value).toEqual("")
  })

  it("when given a boolean attribute, properly renders it in column", () => {
    const columnRenderFn = getDefaultDataRender({
      finalSchemas,
      schemaName: "Todo",
      control: finalSchemas.Todo.attributes.important.control,
      field: "important",
      isRelationship: false,
      isAdditional: false,
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })

    expect(
      // @ts-ignore
      columnRenderFn({ record: { id: "1", important: true } }).props.value,
    ).toEqual(true)
  })

  it("when given a 'dateonly' attribute, properly renders it in column", () => {
    const columnRenderFn = getDefaultDataRender({
      finalSchemas,
      schemaName: "Todo",
      control: finalSchemas.Todo.attributes.created.control,
      field: "created",
      isRelationship: false,
      isAdditional: false,
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })
    const record = { record: { id: "1", created: "2023-10-27T21" } }

    // @ts-ignore
    expect(columnRenderFn(record).props.value).toEqual("2023-10-27T21")
  })

  it("when given a 'relationship' attribute, properly renders it in column", () => {
    const columnRenderFn = getDefaultDataRender({
      finalSchemas,
      schemaName: "Todo",
      control: null,
      field: "user",
      isRelationship: true,
      isAdditional: false,
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })
    const record = {
      record: { id: "1", user: { id: "user-01", type: "User" } },
    }

    // @ts-ignore
    expect(columnRenderFn(record).props.value).toEqual({
      ...record.record.user,
      label: "user-01",
    })
  })

  it("when given a 'relationship value with a label', properly renders it in column", () => {
    const columnRenderFn = getDefaultDataRender({
      finalSchemas,
      schemaName: "Todo",
      control: null,
      field: "user",
      isRelationship: true,
      isAdditional: false,
      defaultValueComponents: HatchifyPresentationDefaultValueComponents,
    })
    const record = {
      record: {
        id: "1",
        user: { id: "user-01", type: "User", __label: "John" },
      },
    }

    // @ts-ignore
    expect(columnRenderFn(record).props.value).toEqual({
      ...record.record.user,
      label: "John",
    })
  })
})
/* eslint-enable testing-library/render-result-naming-convention */
