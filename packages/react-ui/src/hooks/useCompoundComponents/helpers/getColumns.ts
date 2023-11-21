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
  valueComponents: DefaultValueComponentsTypes,
  childArray: JSX.Element[],
  include?: Include<GetSchemaFromName<TSchemas, TSchemaName>>,
): HatchifyColumn[] {
  const hatchifyColumns: HatchifyColumn[] = []
  const schema = finalSchemas[schemaName as string]

  const columns = childArray.filter((c) => c.type.name === "Column")
  const prepend = columns.filter((c) => c.props.type === "prepend")
  const append = columns.filter((c) => c.props.type === "append")
  const replace = columns.filter((c) => c.props.type === "replace")
  const overwrite = columns.filter((c) => !c.props.type)

  const getHatchifyColumnCommon = {
    finalSchemas,
    schemaName: schemaName as string,
    defaultValueComponents: valueComponents,
  }

  for (let i = 0; i < prepend.length; i++) {
    const { props } = prepend[i]
    hatchifyColumns.push(
      getColumn({
        ...getHatchifyColumnCommon,
        control: null,
        field: "",
        compoundComponentProps: props,
        isRelationship: false,
      }),
    )
  }

  if (overwrite.length > 0) {
    for (let i = 0; i < overwrite.length; i++) {
      const { props } = overwrite[i]
      const relationship = schema?.relationships?.[props.field]

      hatchifyColumns.push(
        getColumn({
          ...getHatchifyColumnCommon,
          // once displayAttribute is implemented, it should be used for the control
          control: relationship
            ? null
            : schema.attributes?.[props.field]?.control || null,
          field: props.field,
          compoundComponentProps: props,
          isRelationship: relationship !== undefined,
        }),
      )
    }
  } else {
    const schemaColumns = getColumnsFromSchema(
      finalSchemas,
      schemaName,
      valueComponents,
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
            compoundComponentProps: props,
            isRelationship: relationship !== undefined,
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
      getColumn({
        ...getHatchifyColumnCommon,
        control: null,
        field: "",
        compoundComponentProps: props,
        isRelationship: false,
      }),
    )
  }

  return hatchifyColumns
}
