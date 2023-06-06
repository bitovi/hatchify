import type {
  Fields,
  Include,
  Schemas,
  SchemaMap,
} from "@hatchifyjs/rest-client"

/**
 * Transforms the fields array from rest-client into a JSON:API compliant query parameter.
 * eg.  fieldsToQueryParam(schemaMap, allSchemas, "Book", ["title", "author.name", "illustrators.email"])
 *      returns: "fields[book_type]=title&fields[person_type]=name,email"
 * where "book_type" and "person_type" are the JSON:API types for the "Book" and "Person" schemas.
 */
export function fieldsToQueryParam(
  schemaMap: SchemaMap,
  allSchemas: Schemas,
  schemaName: string,
  fields: Fields,
): string {
  // a Set is used to deduplicate fields. eg. author.name and illustrators.name
  // are different relationships, but both have the same JSON:API type.
  const fieldsByType: globalThis.Record<string, Set<string>> = {}

  for (const field of fields) {
    // if there is no dot, then the field is an attribute of the base schema
    if (!field.includes(".")) {
      const jsonapiType = schemaMap[schemaName].type
      fieldsByType[jsonapiType] = fieldsByType[jsonapiType] || new Set()
      fieldsByType[jsonapiType].add(field)
      continue
    }

    // otherwise, find the JSON:API type of the related schema
    const [relationshipKey, attribute] = field.split(".")
    const baseSchema = allSchemas[schemaName]
    const relationship = baseSchema?.relationships || {}
    const relatedSchema = relationship[relationshipKey].schema
    const jsonapiType = schemaMap[relatedSchema].type
    fieldsByType[jsonapiType] = fieldsByType[jsonapiType] || new Set()
    fieldsByType[jsonapiType].add(attribute)
  }

  const fieldset = Object.entries(fieldsByType)
    .map(([key, attributes]) => `fields[${key}]=${[...attributes].join(",")}`)
    .join("&")

  return fieldset
}

/**
 * Transforms the include array from rest-client into a JSON:API compliant query parameter.
 */
export function includeToQueryParam(includes: Include): string {
  return `include=${includes.join(",")}`
}

/**
 * Transforms the fields and include arrays from rest-client into a JSON:API compliant query parameter.
 */
export function getQueryParams(
  schemaMap: SchemaMap,
  allSchemas: Schemas,
  schemaName: string,
  fields: Fields,
  include: Include,
): string {
  let params = ""

  const fieldsParam = fieldsToQueryParam(
    schemaMap,
    allSchemas,
    schemaName,
    fields,
  )

  // todo: include is undefined here
  if (include) {
    const includeParam = includeToQueryParam(include)

    if (include.length) params += `?${includeParam}&`
    else if (fields.length) params += `?include=`

    params += fieldsParam
  }

  return params
}
