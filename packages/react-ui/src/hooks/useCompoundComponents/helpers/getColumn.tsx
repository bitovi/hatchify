import { camelCaseToTitleCase } from "@hatchifyjs/core"
import type { PartialSchema, FinalAttributeRecord } from "@hatchifyjs/core"
import type { FinalSchemas, GetSchemaNames } from "@hatchifyjs/rest-client"
import type { DefaultDisplayComponentsTypes } from "../../../components/index.js"
import type { HatchifyColumn } from "../useCompoundComponents.js"
import { getDefaultDataRender } from "./index.js"

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
  defaultDisplayComponents,
  sortable,
  key,
}: {
  finalSchemas: FinalSchemas
  schemaName: TSchemaName
  control?: FinalAttributeRecord[string]["control"] | null
  field: string
  compoundComponentProps: any
  isRelationship?: boolean
  defaultDisplayComponents: DefaultDisplayComponentsTypes
  sortable?: boolean
  key: string
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
  const label: string = labelProp || formatFieldAsLabel(field)
  const displayName: string =
    control?.ui?.displayName || camelCaseToTitleCase(label)

  const column: HatchifyColumn = {
    sortable:
      sortable !== undefined ? sortable : !isAdditional && !isRelationship, // reference sortable prop; otherwise sortable if an attribute
    key,
    label,
    renderData: () => null, // default render so TS doesn't complain
    renderHeader: () => null, // default render so TS doesn't complain
    headerOverride: !!(renderHeaderValue ?? HeaderValueComponent),
  }

  // render priority:
  // 1. prop: renderData (render function)
  // 2. prop: renderDataValue (render function)
  // 3. prop: DataValueComponent (component)
  // 4. default render (based on type)

  if (renderData) {
    column.renderData = ({ record }) => renderData({ record })
  } else if (renderDataValue) {
    column.renderData = ({ record }) =>
      renderDataValue({ record, value: record[field] })
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
      defaultDisplayComponents,
    })
  }

  // render priority:
  // 1. prop: renderHeaderValue (render function)
  // 2. prop: HeaderValueComponent (component)
  // 3. render displayName

  if (renderHeaderValue) {
    column.renderHeader = (headerArgs) => {
      return renderHeaderValue(headerArgs)
    }
  } else if (HeaderValueComponent) {
    column.renderHeader = (headerProps) => (
      <HeaderValueComponent {...headerProps} />
    )
  } else {
    column.renderHeader = () => displayName
  }

  return column
}

export function formatFieldAsLabel(field: string): string {
  return field
    .replace(/(^\w)/g, (g) => g[0].toUpperCase())
    .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
    .trim()
}
