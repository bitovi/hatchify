import type { Include, Fields, QueryList, QueryOne, Schema } from "../../types"

/**
 * Get attributes from a schema or a relationship.
 */
export function getAttributesFromSchema(
  schemas: Record<string, Schema>,
  schemaName: string,
  path?: string,
): Fields {
  if (path) {
    const segments = path.split(".")

    for (const segment of segments) {
      schemaName = schemas?.[schemaName]?.relationships?.[segment].schema || ""
    }
  }

  return Object.keys(schemas[schemaName].attributes).map((attribute) =>
    path ? `${path}.${attribute}` : attribute,
  )
}

/**
 * Convert a list of fields (jsonapi fieldsets) to a list of includes (jsonapi includes).
 * https://jsonapi.org/format/#fetching-sparse-fieldsets
 * https://jsonapi.org/format/#fetching-includes
 */
export function getIncludeFromFields(fields: Fields): Include {
  const includes: Record<string, true> = {}

  for (const field of fields) {
    if (!field.includes(".")) continue

    const include = field.slice(0, field.lastIndexOf("."))
    includes[include] = true
  }

  return Object.keys(includes)
}

/**
 * Convert a list of include (jsonapi include) to a list of fields (jsonapi fieldset).
 * https://jsonapi.org/format/#fetching-includes
 * https://jsonapi.org/format/#fetching-sparse-fieldsets
 */
export function getFieldsFromInclude(
  schemas: Record<string, Schema>,
  schemaName: string,
  include: Include,
): Fields {
  const fields: Fields = []

  fields.push(...getAttributesFromSchema(schemas, schemaName))

  for (const relationship of include) {
    fields.push(...getAttributesFromSchema(schemas, schemaName, relationship))
  }

  return fields
}

/**
 * Gets field list from a query.
 */
export function getFields(
  schemas: Record<string, Schema>,
  schemaName: string,
  selector: QueryList | QueryOne,
): Fields {
  if (selector.fields) {
    return selector.fields
  } else if (selector.include !== undefined) {
    return getFieldsFromInclude(schemas, schemaName, selector.include)
  }
  return getAttributesFromSchema(schemas, schemaName)
}
