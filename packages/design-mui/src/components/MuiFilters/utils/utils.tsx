import type { XCollectionProps } from "@hatchifyjs/react-ui"

type HatchifyMuiFilters = string[]

export function getFilterableFields(
  allSchemas: XCollectionProps["finalSchemas"],
  schemaName: XCollectionProps["schemaName"],
  include: string[],
): HatchifyMuiFilters {
  // get all filterable fields from the base schema
  const fields = Object.entries(allSchemas[schemaName].attributes)
    // todo: filtering should not rely on UUID type because it may still be an attribute
    .filter(([, attr]) => attr.orm.sequelize.type !== "UUID")
    .filter(([, attr]) =>
      ["string", "date", "dateonly", "datetime", "enum"].includes(
        attr.control.type.toLowerCase(),
      ),
    )
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
      .filter(([, attr]) =>
        ["string", "date", "datetime", "enum"].includes(
          attr.control.type.toLowerCase(),
        ),
      )
      .map(([key]) => `${includedRelationships[i].relationship}.${key}`)

    fields.push(...includedFields)
  }

  return fields
}
