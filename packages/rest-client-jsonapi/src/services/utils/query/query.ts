import type {
  Fields,
  Filter,
  Include,
  RequiredSchemaMap,
  Schemas,
} from "@hatchifyjs/rest-client"

/**
 * Transforms the fields array from rest-client into a JSON:API compliant query parameter.
 * eg.  fieldsToQueryParam(schemaMap, allSchemas, "Book", ["title", "author.name", "illustrators.email"])
 *      returns: "fields[book_type]=title&fields[person_type]=name,email"
 * where "book_type" and "person_type" are the JSON:API types for the "Book" and "Person" schemas.
 */
export function fieldsToQueryParam(
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
    .map(
      ([key, attributes]) =>
        `fields[${key}]=${[...(attributes as string[])].join(",")}`,
    )
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
      queries.push(
        value.map((v) => `filter[${key}][]=${encodeURIComponent(v)}`).join("&"),
      )
    } else {
      queries.push(`filter[${key}]=${encodeURIComponent(value)}`)
    }
  }

  return queries.join("&")
}

/**
 * Transforms the page variable into page query parameters.
 * { number: 3, size: 30 } => "page[number]=3&page[size]=30"
 * [ 3, 30 ] => "page[number]=3&page[size]=30"
 * "page[number]=3&page[size]=30" => "page[number]=3&page[size]=30"
 * 3 => "page[number]=3"
 */
export function pageToQueryParam(page: unknown): string {
  const queries: string[] = []

  if (typeof page === "string") {
    return page
  } else if (Array.isArray(page)) {
    queries.push(`page[number]=${page[0]}`)
    if (page.length > 1) {
      queries.push(`page[size]=${page[1]}`)
    }
  } else if (typeof page === "object" && page !== null) {
    for (const [key, value] of Object.entries(page)) {
      queries.push(`page[${key}]=${value}`)
    }
  } else if (typeof page === "number") {
    return `page[number]=${page}`
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
  query: {
    fields: Fields
    include: Include
    sort?: string[] | string
    filter?: Filter
    page?: unknown
  },
): string {
  const params = []
  const { fields, include, sort, filter, page } = query

  if (include.length) {
    const includeParam = includeToQueryParam(include)
    if (includeParam) params.push(includeParam)
  }

  if (fields) {
    const fieldsParam = fieldsToQueryParam(allSchemas, schemaName, fields)

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

  if (page) {
    const pageParam = pageToQueryParam(page)
    if (pageParam) params.push(pageParam)
  }

  return params.length ? `?${params.join("&")}` : ""
}
