import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Include,
} from "@hatchifyjs/rest-client"
import type { HatchifyColumn } from "../useCompoundComponents"
import type { DefaultValueComponentsTypes } from "../../../components"
import { getColumn, getColumnsFromSchema } from "."

export function getColumns<
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  finalSchemas: FinalSchemas,
  schemaName: TSchemaName,
  defaultValueComponents: DefaultValueComponentsTypes,
  overwrite: boolean,
  childArray: JSX.Element[],
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>,
): HatchifyColumn[] {
  const hatchifyColumns: HatchifyColumn[] = []
  const schema = finalSchemas[schemaName as string]

  const columns = childArray.filter((c) => c.type.name === "Column")
  const extra = childArray.filter((c) => c.props.field === undefined)
  const replace = columns.filter((c) => c.props.field !== undefined)
  const prepend = extra.filter((c) => c.props.prepend === true)
  const append = extra.filter((c) => c.props.prepend !== true)

  const getHatchifyColumnCommon = {
    finalSchemas,
    schemaName: schemaName as string,
    defaultValueComponents,
  }

  // use JSX order
  if (overwrite) {
    for (let i = 0; i < columns.length; i++) {
      const { props } = columns[i]
      const isExtraColumn = props.field === undefined // not tied to a schema field

      if (isExtraColumn) {
        hatchifyColumns.push(
          getColumn({
            ...getHatchifyColumnCommon,
            control: null,
            field: "",
            key: `extra-${i}`,
            compoundComponentProps: props,
            isRelationship: false,
          }),
        )
      } else {
        const validField = schema?.attributes?.[props.field]
        const relationship = schema?.relationships?.[props.field]

        hatchifyColumns.push(
          getColumn({
            ...getHatchifyColumnCommon,
            // once displayAttribute is implemented, it should be used for the control
            control: relationship
              ? null
              : schema.attributes?.[props.field]?.control || null,
            field: validField ? props.field : "",
            key: validField ? props.field : `overwrite-${i}`,
            compoundComponentProps: props,
            isRelationship: relationship !== undefined,
            sortable: props.sortable,
          }),
        )
      }
    }

    return hatchifyColumns
  }

  // otherwise order is: prepend, schema attributes, schema relationships, append
  for (let i = 0; i < prepend.length; i++) {
    const { props } = prepend[i]

    hatchifyColumns.push(
      getColumn({
        ...getHatchifyColumnCommon,
        control: null,
        field: "",
        key: `prepend-${i}`,
        compoundComponentProps: props,
        isRelationship: false,
      }),
    )
  }

  const schemaColumns = getColumnsFromSchema(
    finalSchemas,
    schemaName,
    defaultValueComponents,
    include,
  )

  for (let i = 0; i < schemaColumns.length; i++) {
    const replaceWith = replace.find(
      (c) => c.props.field === schemaColumns[i].key,
    )

    if (replaceWith) {
      const { props } = replaceWith
      const relationship = schema?.relationships?.[props.field]

      hatchifyColumns.push(
        getColumn({
          ...getHatchifyColumnCommon,
          // once displayAttribute is implemented, it should be used for the control
          control: relationship
            ? null
            : schema.attributes?.[props.field]?.control || null,
          field: props.field,
          key: props.field,
          compoundComponentProps: props,
          isRelationship: relationship !== undefined,
          sortable: props.sortable,
        }),
      )
    } else {
      hatchifyColumns.push(schemaColumns[i])
    }
  }

  for (let i = 0; i < append.length; i++) {
    const { props } = append[i]

    hatchifyColumns.push(
      getColumn({
        ...getHatchifyColumnCommon,
        control: null,
        field: "",
        key: `append-${i}`,
        compoundComponentProps: props,
        isRelationship: false,
      }),
    )
  }

  return hatchifyColumns
}
