import type { Schema } from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../components"
import type { HatchifyDisplay } from "../services"
import { Children as ReactChildren } from "react"
import { getDisplaysFromSchema, getHatchifyDisplay } from "../services"

interface CompoundComponents {
  columns: HatchifyDisplay[]
  Empty: () => JSX.Element
}

export default function useCompoundComponents(
  schema: Schema,
  valueComponents: DefaultValueComponentsTypes,
  children: React.ReactNode | null,
): CompoundComponents {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]

  return {
    columns: getColumns(schema, valueComponents, childArray),
    Empty: getEmptyList(childArray),
  }
}

export function getColumns(
  schema: Schema,
  valueComponents: DefaultValueComponentsTypes,
  childArray: JSX.Element[],
): HatchifyDisplay[] {
  const hatchifyColumns: HatchifyDisplay[] = []

  const columns = childArray.filter((c) => c.type.name === "Column")
  const prepend = columns.filter((c) => c.props.type === "prepend")
  const append = columns.filter((c) => c.props.type === "append")
  const replace = columns.filter((c) => c.props.type === "replace")
  const overwrite = columns.filter((c) => !c.props.type)

  for (let i = 0; i < prepend.length; i++) {
    const { props } = prepend[i]
    hatchifyColumns.push(
      getHatchifyDisplay({
        sortable: false,
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        render: props.renderValue,
        ValueComponent: props.ValueComponent,
        defaultValueComponents: valueComponents,
      }),
    )
  }

  if (overwrite.length > 0) {
    for (let i = 0; i < overwrite.length; i++) {
      const { props } = overwrite[i]
      const relationship = schema?.relationships?.[props.field]

      hatchifyColumns.push(
        getHatchifyDisplay({
          sortable: true,
          isRelationship: relationship !== undefined,
          label: props.label || null,
          attribute: props.field,
          attributeSchema: relationship
            ? null
            : schema.attributes?.[props.field],
          renderValue: props.renderValue,
          ValueComponent: props.ValueComponent,
          defaultValueComponents: valueComponents,
        }),
      )
    }
  } else {
    const schemaColumns = getDisplaysFromSchema(schema, valueComponents, null)

    for (let i = 0; i < schemaColumns.length; i++) {
      const replaceWith = replace.find(
        (c) => c.props.field === schemaColumns[i].key,
      )

      if (replaceWith) {
        const { props } = replaceWith
        const relationship = schema?.relationships?.[props.field]

        hatchifyColumns.push(
          getHatchifyDisplay({
            sortable: true,
            isRelationship: relationship !== undefined,
            label: props.label || null,
            attribute: props.field,
            attributeSchema: relationship
              ? null
              : schema.attributes?.[props.field],
            renderValue: props.renderValue,
            ValueComponent: props.ValueComponent,
            defaultValueComponents: valueComponents,
          }),
        )
      } else {
        hatchifyColumns.push(schemaColumns[i])
      }
    }
  }

  for (let i = 0; i < append.length; i++) {
    const { props } = append[i]
    hatchifyColumns.push(
      getHatchifyDisplay({
        sortable: false,
        isExtraDisplay: true,
        label: props.label,
        attribute: props.label,
        render: props.renderValue,
        ValueComponent: props.ValueComponent,
        defaultValueComponents: valueComponents,
      }),
    )
  }

  return hatchifyColumns
}

export function getEmptyList(childArray: JSX.Element[]): () => JSX.Element {
  const emptyComponent = childArray.find((c) => c.type.name === "EmptyList")
  const emptyDisplay: JSX.Element = emptyComponent?.props.children || undefined
  const EmptyList = () => emptyDisplay || <div>No records found</div>
  return EmptyList
}
