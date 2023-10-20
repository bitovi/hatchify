import { FinalSchema } from "@hatchifyjs/core"
import type { Include, Fields, QueryList, QueryOne } from "../../types"

/**
 * Get attributes from a schema or a relationship.
 */
export function getAttributesFromSchema(
  schemas: Record<string, FinalSchema>,
  schemaName: string,
  path?: string,
): Fields {
  if (path) {
    const segments = path.split(".")

    for (const segment of segments) {
      schemaName =
        schemas?.[schemaName]?.relationships?.[segment].targetSchema || ""
    }
  }

  const fields: Fields = {}

  fields[path ? path : schemaName] = Object.entries(
    schemas[schemaName].attributes,
  )
    // todo: filtering should not rely on UUID type because it may still be an attribute
    .filter(([attribute, details]) => details.orm.sequelize.type !== "UUID")
    .map(([attribute]) => attribute)
  return fields
}

/**
 * Convert a list of fields (JSON:API fieldsets) to a list of includes (JSON:API includes).
 * https://jsonapi.org/format/#fetching-sparse-fieldsets
 * https://jsonapi.org/format/#fetching-includes
 */

export function getIncludeFromFields(
  fields: Fields,
  schemaName: string,
): Include {
  const includes: Record<string, true> = {}

  const fieldKeys = Object.keys(fields)

  for (const field of fieldKeys) {
    if (field === schemaName) {
      continue
    }

    const include = field
    includes[include] = true
  }
  return Object.keys(includes)
}

/**
 * Convert a list of include (JSON:API include) to a list of fields (JSON:API fieldset).
 * https://jsonapi.org/format/#fetching-includes
 * https://jsonapi.org/format/#fetching-sparse-fieldsets
 */
export function getFieldsFromInclude(
  schemas: Record<string, FinalSchema>,
  schemaName: string,
  include: Include,
): Fields {
  let fields: Fields = { ...getAttributesFromSchema(schemas, schemaName) }

  for (const relationship of include) {
    fields = {
      ...fields,
      ...getAttributesFromSchema(schemas, schemaName, relationship),
    }
  }

  return fields
}

/**
 * Get the to-one relationships as fields: [`${relationshipKey}.${displayAttribute}`, ...]
 */
export function getToOneRelationshipsAsFields(
  schemas: Record<string, FinalSchema>,
  schemaName: string,
): Fields {
  return Object.assign(
    {},
    ...Object.entries(schemas[schemaName]?.relationships || [])
      .filter(([key, relationship]) => {
        return (
          relationship.type === "belongsTo" || relationship.type === "hasOne"
        )
      })
      .map(([key, relationship]) => {
        return {
          [`${key}`]: [
            `${schemas[relationship.targetSchema].displayAttribute || "id"}`,
          ],
        }
      }),
  )
}

/**
 * Get the to-one relationships as include: [`${relationshipKey}`, ...]
 */
export function getToOneRelationshipsAsInclude(
  schemas: Record<string, FinalSchema>,
  schemaName: string,
): Include {
  return Object.entries(schemas[schemaName]?.relationships || [])
    .filter(([key, relationship]) => {
      return relationship.type === "belongsTo" || relationship.type === "hasOne"
    })
    .map(([key, relationship]) => {
      return key
    })
}

/**
 * Either returns the fields from the selector, generates them from the include, or
 * returns the default fields (all attributes and to-one relationships).
 */
export function getFields(
  schemas: Record<string, FinalSchema>,
  schemaName: string,
  selector: QueryList | QueryOne,
): Fields {
  if (selector.fields) {
    return selector.fields
  } else if (selector.include !== undefined) {
    return getFieldsFromInclude(schemas, schemaName, selector.include)
  }

  return {
    ...getAttributesFromSchema(schemas, schemaName),
    ...getToOneRelationshipsAsFields(schemas, schemaName),
  }
}

/**
 * Either returns the include from the selector, generates them from the fields, or
 * returns the default include (all to-one relationships).
 */
export function getInclude(
  schemas: Record<string, FinalSchema>,
  schemaName: string,
  selector: QueryList | QueryOne,
): Include {
  if (selector.include) {
    return selector.include
  } else if (selector.fields !== undefined) {
    return getIncludeFromFields(selector.fields, schemaName)
  }

  return getToOneRelationshipsAsInclude(schemas, schemaName)
}
