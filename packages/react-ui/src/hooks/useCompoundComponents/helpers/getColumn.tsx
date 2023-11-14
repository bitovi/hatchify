import { uuidv4 } from "@hatchifyjs/core"
import type { FinalAttributeRecord } from "@hatchifyjs/core"
import type { FinalSchemas } from "@hatchifyjs/rest-client"
import type { DefaultValueComponentsTypes } from "../../../components"
import type { HatchifyColumn } from "../useCompoundComponents"
import { getDefaultColumnRender } from "."

export function getColumn({
  finalSchemas,
  schemaName,
  control,
  field,
  compoundComponentProps,
  isRelationship,
  defaultValueComponents,
}: {
  finalSchemas: FinalSchemas
  schemaName: string
  control?: FinalAttributeRecord[string]["control"] | null
  field: string
  compoundComponentProps: any
  isRelationship?: boolean
  defaultValueComponents: DefaultValueComponentsTypes
}): HatchifyColumn {
  const { ValueComponent } = compoundComponentProps
  const isAdditional = control == null
  const label = compoundComponentProps?.label || formatFieldAsLabel(field || "")
  console.log("label", label)
  // const label = "Asdfasdfa"

  const column: HatchifyColumn = {
    sortable: !isAdditional && !isRelationship, // sortable if an attribute
    key: field || uuidv4(), // if no field, then it's an additional column, but needs a key?
    label,
    render: () => null, // default render so TS doesn't complain
  }

  // render priority:
  // 1. prop: render (render function)
  // 2. prop: renderValue (render function)
  // 3. prop: ValueComponent (component)
  // 4. default render (based on type)

  if (compoundComponentProps.render) {
    column.render = ({ record }) => compoundComponentProps.render({ record })
  } else if (compoundComponentProps.renderValue) {
    column.render = ({ record }) =>
      compoundComponentProps.renderValue({ record })
  } else if (ValueComponent) {
    column.render = ({ record }) => (
      <ValueComponent
        record={record}
        field={field}
        value={record[field]}
        control={control}
      />
    )
  } else {
    column.render = getDefaultColumnRender({
      finalSchemas,
      schemaName,
      control,
      field: field,
      isRelationship: isRelationship === true,
      isAdditional,
      defaultValueComponents,
    })
  }

  return column
}

export function formatFieldAsLabel(field: string): string {
  return field
    .replace(/(^\w)/g, (g) => g[0].toUpperCase())
    .replace(/([-_]\w)/g, (g) => " " + g[1].toUpperCase())
    .trim()
}
