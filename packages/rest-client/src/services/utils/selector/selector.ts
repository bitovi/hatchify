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
 * Convert a list of fields (JSON:API fieldsets) to a list of includes (JSON:API includes).
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
 * Convert a list of include (JSON:API include) to a list of fields (JSON:API fieldset).
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
 * Get the to-one relationships as fields: [`${relationshipKey}.${displayAttribute}`, ...]
 */
export function getToOneRelationshipsAsFields(
  schemas: Record<string, Schema>,
  schemaName: string,
): Fields {
  return Object.entries(schemas[schemaName]?.relationships || [])
    .filter(([key, relationship]) => {
      return relationship.type === "one"
    })
    .map(([key, relationship]) => {
      return `${key}.${schemas[relationship.schema].displayAttribute || "id"}`
    })
}

/**
 * Get the to-one relationships as include: [`${relationshipKey}`, ...]
 */
export function getToOneRelationshipsAsInclude(
  schemas: Record<string, Schema>,
  schemaName: string,
): Include {
  return Object.entries(schemas[schemaName]?.relationships || [])
    .filter(([key, relationship]) => {
      return relationship.type === "one"
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
  schemas: Record<string, Schema>,
  schemaName: string,
  selector: QueryList | QueryOne,
): Fields {
  if (selector.fields) {
    return selector.fields
  } else if (selector.include !== undefined) {
    return getFieldsFromInclude(schemas, schemaName, selector.include)
  }

  return [
    ...getAttributesFromSchema(schemas, schemaName),
    ...getToOneRelationshipsAsFields(schemas, schemaName),
  ]
}

/**
 * Either returns the include from the selector, generates them from the fields, or
 * returns the default include (all to-one relationships).
 */
export function getInclude(
  schemas: Record<string, Schema>,
  schemaName: string,
  selector: QueryList | QueryOne,
): Include {
  if (selector.include) {
    return selector.include
  } else if (selector.fields !== undefined) {
    return getIncludeFromFields(selector.fields)
  }

  return getToOneRelationshipsAsInclude(schemas, schemaName)
}
