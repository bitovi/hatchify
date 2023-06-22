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

  let queries: string[] = []

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

  if (include && include.length > 0) {
    const includeParam = includeToQueryParam(include)
    params.push(includeParam)
  }

  // todo: wait for backend to fix fields, using fieldsParam does not return an id in each object

  if (sort) {
    const sortParam = sortToQueryParam(sort)
    params.push(sortParam)
  }

  if (filter) {
    const filterParam = filterToQueryParam(filter)
    params.push(filterParam)
  }

  return params.length ? `?${params.join("&")}` : ""
}
