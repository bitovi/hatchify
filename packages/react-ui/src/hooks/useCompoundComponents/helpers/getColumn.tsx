import { uuidv4 } from "@hatchifyjs/core"
import type { PartialSchema, FinalAttributeRecord } from "@hatchifyjs/core"
import type { FinalSchemas, GetSchemaNames } from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../../../components"
import type { HatchifyColumn } from "../useCompoundComponents"
import { getDefaultDataRender } from "."

export function getColumn<
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>({
  finalSchemas,
  schemaName,
  control,
  field,
  compoundComponentProps,
  isRelationship,
  defaultValueComponents,
  sortable,
}: {
  finalSchemas: FinalSchemas
  schemaName: TSchemaName
  control?: FinalAttributeRecord[string]["control"] | null
  field: string
  compoundComponentProps: any
  isRelationship?: boolean
  defaultValueComponents: DefaultValueComponentsTypes
  sortable?: boolean
}): HatchifyColumn {
  const {
    label: labelProp,
    renderHeaderValue,
    HeaderValueComponent,
    renderDataValue,
    DataValueComponent,
    renderData,
  } = compoundComponentProps

  const isAdditional = control == null
  const label = labelProp || formatFieldAsLabel(field || "")

  const column: HatchifyColumn = {
    sortable:
      sortable !== undefined ? sortable : !isAdditional && !isRelationship, // sortable if an attribute
    key: field || uuidv4(), // if no field, then it's an additional column, but needs a key?
    label,
    renderData: () => null, // default render so TS doesn't complain
    renderHeader: () => null, // default render so TS doesn't complain
    isHeaderOverridden: renderHeaderValue ?? HeaderValueComponent ?? false,
  }

  // render priority:
  // 1. prop: render (render function)
  // 2. prop: renderValue (render function)
  // 3. prop: ValueComponent (component)
  // 4. default render (based on type)

  if (renderData) {
    column.renderData = ({ record }) => renderData({ record })
  } else if (renderDataValue) {
    column.renderData = ({ record }) => renderDataValue({ record })
  } else if (DataValueComponent) {
    column.renderData = ({ record }) => (
      <DataValueComponent
        record={record}
        field={field}
        value={record[field]}
        control={control}
      />
    )
  } else {
    column.renderData = getDefaultDataRender({
      finalSchemas,
      schemaName: schemaName as string,
      control,
      field: field,
      isRelationship: isRelationship === true,
      isAdditional,
      defaultValueComponents,
    })
  }

  if (renderHeaderValue) {
    column.renderHeader = (headerArgs) => {
      return renderHeaderValue(headerArgs)
    }
  } else if (HeaderValueComponent) {
    column.renderHeader = (headerProps) => (
      <HeaderValueComponent {...headerProps} />
    )
  } else {
    column.renderHeader = () => label
  }

  return column
}

export function formatFieldAsLabel(field: string): string {
  return field
    .replace(/(^\w)/g, (g) => g[0].toUpperCase())
    .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
    .trim()
}
