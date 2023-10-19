import type { XCollectionProps } from "@hatchifyjs/react-ui"

type HatchifyMuiFilters = string[]

export function getFilterableFields(
  allSchemas: XCollectionProps["finalSchemas"],
  schemaName: XCollectionProps["schemaName"],
  include: string[],
): HatchifyMuiFilters {
  // get all filterable fields from the base schema
  const fields = Object.entries(allSchemas[schemaName].attributes)
    .filter(([, attr]) => {
      const type = attr.control.type.toLowerCase()
      return ["string", "date", "datetime", "enum"].includes(type)
    })
    .map(([key]) => key)

  // // get related schemas that are part of the include
  // todo: v2 relationships
  // const includedRelationships = Object.entries(
  //   allSchemas[schemaName].relationships || {},
  // )
  //   .map(([key, obj]) => ({
  //     relationship: key,
  //     schema: obj.schema,
  //   }))
  //   .filter((item) => include?.includes(item.relationship))

  // // for each included schema, get all filterable fields
  // for (let i = 0; i < includedRelationships.length; i++) {
  //   const includedFields = Object.entries(
  //     allSchemas[includedRelationships[i].schema].attributes,
  //   )
  //     .filter(([, attr]) =>
  //       typeof attr === "object"
  //         ? attr.type === "string" ||
  //           attr.type === "date" ||
  //           attr.type === "enum"
  //         : attr === "string" || attr === "date",
  //     )
  //     .map(([key]) => `${includedRelationships[i].relationship}.${key}`)

  //   fields.push(...includedFields)
  // }

  return fields
}
