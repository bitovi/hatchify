import type {
  Fields,
  Include,
  Schemas,
  RequiredSchemaMap,
} from "@hatchifyjs/rest-client"

/**
 * Transforms the fields array from rest-client into a JSON:API compliant query parameter.
 * eg.  fieldsToQueryParam(schemaMap, allSchemas, "Book", ["title", "author.name", "illustrators.email"])
 *      returns: "fields[book_type]=title&fields[person_type]=name,email"
 * where "book_type" and "person_type" are the JSON:API types for the "Book" and "Person" schemas.
 */
export function fieldsToQueryParam(
  schemaMap: RequiredSchemaMap,
  allSchemas: Schemas,
  schemaName: string,
  fields: Fields,
): string {
  const fieldsArr = Object.keys(fields)
  const fieldsObj: Fields = {}
  for (const field of fieldsArr) {
    // if field is equal to the schemaName, then the field is an attribute of the base schema
    if (field === schemaName) {
      fieldsObj[schemaName] = fields[field]
      continue
    }

    const baseSchema = allSchemas[schemaName]
    const relationship = baseSchema?.relationships || {}
    const relatedSchema = relationship[field].schema
    fieldsObj[relatedSchema] = fields[field]
  }

  const fieldset = Object.entries(fieldsObj)
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
  schemaMap: RequiredSchemaMap,
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

  if (include) {
    const includeParam = includeToQueryParam(include)
    if (include.length) {
      params += `?${includeParam}&`
      if (fieldsParam) {
        params += fieldsParam
      }
    } else if (fieldsParam) {
      params += `?include=${fieldsParam}`
    }
  }

  return params
}
