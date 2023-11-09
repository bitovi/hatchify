import type { FinalSchema } from "@hatchifyjs/core"
import type { HatchifyDisplay } from "../services"
import type { DefaultValueComponentsTypes } from "../components"
import { useHatchifyPresentation } from "../components"
import { Children as ReactChildren } from "react"
import { getDisplaysFromSchema, getHatchifyDisplay } from "../services"

interface CompoundComponents {
  columns: HatchifyDisplay[]
  Empty: () => JSX.Element
}

export default function useCompoundComponents(
  schema: FinalSchema,
  children: React.ReactNode | null,
): CompoundComponents {
  const childArray = ReactChildren.toArray(children) as JSX.Element[]
  const defaultValueComponents =
    useHatchifyPresentation().defaultValueComponents

  return {
    columns: getColumns(schema, defaultValueComponents, childArray),
    Empty: getEmptyList(childArray),
  }
}

export function getColumns(
  schema: FinalSchema,
  defaultValueComponents: DefaultValueComponentsTypes,
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
        dataCellRender: props.dataCellRenderValue,
        headerCellRender: props.headerCellRenderValue,
        DataCellValueComponent: props.DataCellValueComponent,
        defaultValueComponents,
      }),
    )
  }

  if (overwrite.length > 0) {
    for (let i = 0; i < overwrite.length; i++) {
      const { props } = overwrite[i]
      const field = schema?.attributes?.[props.field]
      const relationship = schema?.relationships?.[props.field]

      hatchifyColumns.push(
        getHatchifyDisplay({
          sortable: field !== undefined,
          isRelationship: relationship !== undefined,
          label: props.label || null,
          attribute: props.field,
          attributeSchema: relationship
            ? null
            : schema.attributes?.[props?.field]?.control,
          dataCellRenderValue: props.dataCellRenderValue,
          headerCellRender: props.headerCellRenderValue,
          DataCellValueComponent: props.DataCellValueComponent,
          defaultValueComponents,
        }),
      )
    }
  } else {
    const schemaColumns = getDisplaysFromSchema(
      schema,
      defaultValueComponents,
      null,
    )

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
              : schema.attributes?.[props.field].control,
            dataCellRender: props.dataCellRenderValue,
            headerCellRender: props.headerCellRenderValue,
            DataCellValueComponent: props.DataCellValueComponent,
            defaultValueComponents,
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
        dataCellRender: props.dataCellRenderValue,
        headerCellRender: props.headerCellRenderValue,
        DataCellValueComponent: props.DataCellValueComponent,
        defaultValueComponents,
      }),
    )
  }

  return hatchifyColumns
}

export function getEmptyList(childArray: JSX.Element[]): () => JSX.Element {
  const emptyComponent = childArray.find((c) => c.type.name === "Empty")
  const emptyDisplay: JSX.Element = emptyComponent?.props.children || undefined
  const EmptyList = () => emptyDisplay || <div>No records found</div>
  return EmptyList
}
