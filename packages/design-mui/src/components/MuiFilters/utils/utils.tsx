import type { XDataGridProps } from "@hatchifyjs/react-ui"
import { filterableControlTypes } from "../constants.js"

type HatchifyMuiFilters = string[]

export function getFilterableFields(
  allSchemas: XDataGridProps["finalSchemas"],
  schemaName: XDataGridProps["schemaName"],
  include: string[],
): HatchifyMuiFilters {
  // get all filterable fields from the base schema
  const fields = Object.entries(allSchemas[schemaName].attributes)
    .filter(([, { control }]) => control.ui.hidden !== true)
    .filter(([, { control }]) => filterableControlTypes.includes(control.type))
    .map(([key]) => key)

  // get related schemas that are part of the include
  const includedRelationships = Object.entries(
    allSchemas[schemaName].relationships || {},
  )
    .map(([key, obj]) => ({
      relationship: key,
      schema: obj.targetSchema,
    }))
    .filter((item) => include?.includes(item.relationship))

  // for each included schema, get all filterable fields
  for (let i = 0; i < includedRelationships.length; i++) {
    const includedFields = Object.entries(
      allSchemas[includedRelationships[i].schema].attributes,
    )
      .filter(([, { control }]) => control.ui.hidden !== true)
      .filter(([, { control }]) =>
        filterableControlTypes.includes(control.type),
      )
      .map(([key]) => `${includedRelationships[i].relationship}.${key}`)

    fields.push(...includedFields)
  }

  return fields
}
