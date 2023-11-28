import { describe, it, expect } from "vitest"
import {
  assembler,
  belongsTo,
  boolean,
  dateonly,
  hasMany,
  string,
} from "@hatchifyjs/core"
import { getDefaultDataRender } from "."
import { HatchifyPresentationDefaultValueComponents } from "../../../components"

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

  it("works for attribute", () => {
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

  it("returns empty string for attribute with no value", () => {
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

  it("works for boolean attribute", () => {
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

  it("works for dateonly attribute", () => {
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

  it("works for relationship", () => {
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

  it("works for relationship with label", () => {
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
