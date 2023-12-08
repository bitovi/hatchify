import type { PartialSchema } from "@hatchifyjs/core"
import type {
  Fields,
  FilterTypes,
  Filters,
  FiltersObject,
  FinalSchemas,
  Include,
  RestClientSchemaMap,
} from "@hatchifyjs/rest-client"

/**
 * Transforms the fields array from rest-client into a JSON:API compliant query parameter.
 * eg.  fieldsToQueryParam(schemaMap, allSchemas, "Book", ["title", "author.name", "illustrators.email"])
 *      returns: "fields[book_type]=title&fields[person_type]=name,email"
 * where "book_type" and "person_type" are the JSON:API types for the "Book" and "Person" schemas.
 */
export function fieldsToQueryParam(
  schemaMap: RestClientSchemaMap, // todo: HATCH-417
  allSchemas: FinalSchemas,
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
      throw new Error(`"${field}" is not a valid schema`) // TODO need to handle namespace.field. Jira link: https://bitovi.atlassian.net/browse/HATCH-387
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
export function includeToQueryParam<const TSchema extends PartialSchema>(
  includes: Include<TSchema>,
): string {
  return includes.length ? `include=${includes.join(",")}` : ""
}

/**
 * Transforms the sort array or string from rest-client into a JSON:API compliant query parameter.
 */
export function sortToQueryParam(sort: string[] | string): string {
  return Array.isArray(sort) ? `sort=${sort.join(",")}` : `sort=${sort}`
}

/** Helper function for `filterToQueryParam` */
export function encodeValue(
  operator: string,
  value: string | string[] | number | number[] | boolean | boolean[],
): string | null {
  if (operator === "empty" || operator === "nempty") {
    return "%00"
  }

  if (["istarts", "iends", "icontains"].includes(operator)) {
    return encodeURIComponent(
      operator === "istarts"
        ? `${value}%`
        : operator === "iends"
        ? `%${value}`
        : `%${value}%`,
    )
  }

  if (
    // We need the UTC iso in the request, but we need the local iso in the frontend.
    /([12][0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]))/i.test(
      value.toString(),
    )
  ) {
    return encodeURIComponent(new Date(value.toString()).toISOString())
  }

  return encodeURIComponent(Array.isArray(value) ? value.join(",") : value)
}

/** Helper function for `filterToQueryParam` */
export function getOperator(operator: string): string {
  if (operator === "empty" || operator === "nempty") {
    return operator === "empty" ? "$eq" : "$ne"
  }

  if (["istarts", "iends", "icontains"].includes(operator)) {
    return "$ilike"
  }

  return operator
}
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

  let filtersObject: FiltersObject = {}

  // convert array of `FilterArray` (from ui component) into `FiltersObject`
  if (Array.isArray(filter)) {
    filtersObject = filter.reduce((acc, curr) => {
      const { field, value, operator } = curr as {
        field: string
        value: any
        operator: FilterTypes
      }

      if (!acc[field]) {
        acc[field] = { [operator]: value }
      } else if (!acc[field][operator]) {
        acc[field][operator] = value
      } else {
        const currentValue = acc[field][operator]
        const filterValue = Array.isArray(value) ? value : [value]
        if (Array.isArray(currentValue)) {
          acc[field][operator] = [...currentValue, ...filterValue]
        } else {
          acc[field][operator] = [currentValue, ...filterValue]
        }
      }

      return acc
    }, {} as FiltersObject)
  } else {
    filtersObject = filter
  }

  const query: string[] = []

  Object.entries(filtersObject).forEach(([field, filters]) => {
    Object.entries(filters).forEach(([op, val]) => {
      const operator = getOperator(op)

      if (
        Array.isArray(val) &&
        // only these operators support array values
        ["$in", "$nin", "$like", "$ilike"].includes(operator)
      ) {
        val.forEach((v) => {
          query.push(`filter[${field}][${operator}][]=${encodeValue(op, v)}`)
        })
      } else {
        query.push(`filter[${field}][${operator}]=${encodeValue(op, val)}`)
      }
    })
  })

  return query.join("&")
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
export function getQueryParams<const TSchema extends PartialSchema>(
  schemaMap: RestClientSchemaMap, // todo: HATCH-417
  allSchemas: FinalSchemas,
  schemaName: string,
  query: {
    fields?: Fields
    include?: Include<TSchema>
    sort?: string[] | string
    filter?: Filters
    page?: unknown
  },
  baseFilter?: Filters,
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

  if (baseFilter) {
    const baseFilterParam = filterToQueryParam(baseFilter)
    if (baseFilterParam) {
      params.push(baseFilterParam)
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
