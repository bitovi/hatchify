import type {
  Fields,
  Filters,
  FinalSchemas,
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
  schemaMap: RequiredSchemaMap,
  allSchemas: Schemas | FinalSchemas,
  schemaName: string,
  fields: Fields,
): string {
  const fieldsArr = Object.keys(fields)
  const fieldsObj: Fields = {}
  for (const field of fieldsArr) {
    // if field is equal to the schemaName, then the field is an attribute of the base schema
    if (field === schemaName) {
      fieldsObj[schemaMap[schemaName].type] = fields[field]
      continue
    }

    if (schemaMap[field] === undefined) {
      throw new Error(`"${field}" is not a valid schema`)
    }

    fieldsObj[schemaMap[field].type] = fields[field]
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
 * { name: ["John", "Jane"], operator: "$eq" } => "filter[name][$eq]=John&filter[name][$eq]=Jane"
 * [{name: "John", operator: "$eq"}, {age: 30, operator: "$gte"}] => "filter[name][$eq]=John&filter[age][$gte]=30"
 */

/**
 * Transforms the filter from an array into a JSON:API compliant query parameter.
 * [{ field: "name", value: "John", operator: "$eq" }] => "filter[name][$eq]=John"
 */
export function filterToQueryParam(filter: Filters): string {
  if (filter === undefined) {
    return ""
  }

  if (typeof filter === "string") {
    return filter
  }

  const q: string[] = []

  if (typeof filter === "object" && !Array.isArray(filter)) {
    for (const [key, value] of Object.entries(filter)) {
      if (value == null) {
        q.push(`filter[${key}]=${null}`)
      } else if (Array.isArray(value)) {
        q.push(
          value
            .map((v) => `filter[${key}][]=${encodeURIComponent(v.toString())}`)
            .join("&"),
        )
      } else {
        q.push(`filter[${key}]=${encodeURIComponent(value.toString())}`)
      }
    }

    return q.join("&")
  }

  //We need the UTC iso in the request, but we need the local iso in the frontend.
  const DATE_REGEX = new RegExp(
    /([12][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]))/i,
  )
  const likeOperators = ["istarts", "iends", "icontains"]

  for (let i = 0; i < filter.length; i++) {
    const { operator, field, value } = filter[i]
    if (likeOperators.includes(operator)) {
      const wildcardOperator =
        operator === "istarts"
          ? `${value}%`
          : operator === "iends"
          ? `%${value}`
          : `%${value}%`
      q.push(
        `filter[${field}][$ilike]=${encodeURIComponent(`${wildcardOperator}`)}`,
      )
    } else if (operator === "empty" || operator === "nempty") {
      q.push(
        `filter[${field}][${operator === "empty" ? "$eq" : "$ne"}]=${null}`,
      )
    } else if (Array.isArray(value)) {
      q.push(
        value
          .map((v) => `filter[${field}][${operator}]=${encodeURIComponent(v)}`)
          .join("&"),
      )
    } else {
      q.push(
        `filter[${field}][${operator}]=${encodeURIComponent(
          DATE_REGEX.test(value.toString())
            ? new Date(value.toString()).toISOString()
            : value,
        )}`,
      )
    }
  }

  return q.join("&")
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
  allSchemas: Schemas | FinalSchemas,
  schemaName: string,
  query: {
    fields?: Fields
    include?: Include
    sort?: string[] | string
    filter?: Filters
    page?: unknown
  },
): string {
  const params = []
  const { fields, include, sort, filter, page } = query

  if (include) {
    const includeParam = includeToQueryParam(include)
    if (includeParam) {
      params.push(includeParam)
    }
  }

  if (fields) {
    if (!isFields(fields)) {
      throw new Error(
        "fields must be an object of `{ [schemaName]: string[] }`",
      )
    }

    const fieldsParam = fieldsToQueryParam(
      schemaMap,
      allSchemas,
      schemaName,
      fields,
    )
    if (fieldsParam) {
      params.push(fieldsParam)
    }
  }

  if (sort) {
    const sortParam = sortToQueryParam(sort)
    if (sortParam) {
      params.push(sortParam)
    }
  }

  if (filter) {
    const filterParam = filterToQueryParam(filter)
    if (filterParam) {
      params.push(filterParam)
    }
  }

  if (page) {
    const pageParam = pageToQueryParam(page)
    if (pageParam) {
      params.push(pageParam)
    }
  }

  return params.length ? `?${params.join("&")}` : ""
}

export const isFields = (query: unknown): query is Fields =>
  typeof query === "object" && query !== null && !Array.isArray(query)
