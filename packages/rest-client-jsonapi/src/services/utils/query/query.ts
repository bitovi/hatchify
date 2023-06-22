import type {
  Fields,
  Include,
  Schemas,
  RequiredSchemaMap,
  Filter,
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
  return includes.length ? `include=${includes.join(",")}` : ""
}

/**
 * Transforms the sort array or string from rest-client into a JSON:API compliant query parameter.
 */
export function sortToQueryParam(sort: string[] | string): string {
  return Array.isArray(sort) ? `sort=${sort.join(",")}` : `sort=${sort}`
}

/**
 * Transforms the filter object into filter query parameters.
 * { name: "John", age: 30 } => "filter[name]=John&filter[age]=30"
 * { name: ["John", "Jane"] } => "filter[name][]=John&filter[name][]=Jane"
 */
export function filterToQueryParam(filter: Filter): string {
  if (typeof filter === "string") {
    return filter
  }

  const queries: string[] = []

  for (const [key, value] of Object.entries(filter)) {
    if (Array.isArray(value)) {
      queries.push(value.map((v) => `filter[${key}][]=${v}`).join("&"))
    } else {
      queries.push(`filter[${key}]=${value}`)
    }
  }

  return queries.join("&")
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
  sort?: string[] | string,
  filter?: Filter,
): string {
  const params = []

  if (include.length) {
    const includeParam = includeToQueryParam(include)
    if (includeParam) params.push(includeParam)
  }

  if (fields) {
    const fieldsParam = fieldsToQueryParam(
      schemaMap,
      allSchemas,
      schemaName,
      fields,
    )

    if (fieldsParam) params.push(fieldsParam)
  }

  if (sort) {
    const sortParam = sortToQueryParam(sort)
    if (sortParam) params.push(sortParam)
  }

  if (filter) {
    const filterParam = filterToQueryParam(filter)
    if (filterParam) params.push(filterParam)
  }

  return params.length ? `?${params.join("&")}` : ""
}
