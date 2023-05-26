import type { Source, SchemaMap, Resource } from "@hatchifyjs/rest-client"
import type { Fields, Include, Schemas } from "@hatchifyjs/rest-client"
import { createOne, deleteOne, getList, getOne, updateOne } from ".."

export interface JsonApiResource {
  id: string | number
  type: string
  attributes?: { [key: string]: string | number | boolean | null }
  // todo relationships
}

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(baseUrl: string, schemaMap: SchemaMap): Source {
  const config = { baseUrl, schemaMap }

  return {
    version: 0,
    getList: (allSchemas, schemaName, query) =>
      getList(config, allSchemas, schemaName, query),
    getOne: (allSchemas, schemaName, query) =>
      getOne(config, allSchemas, schemaName, query),
    createOne: (allSchemas, schemaName, data) =>
      createOne(config, allSchemas, schemaName, data),
    updateOne: (allSchemas, schemaName, data) =>
      updateOne(config, allSchemas, schemaName, data),
    deleteOne: (allSchemas, schemaName, id) =>
      deleteOne(config, allSchemas, schemaName, id),
  }
}

export async function fetchJsonApi(
  method: "GET" | "POST" | "PATCH" | "DELETE",
  url: string,
  body?: { [key: string]: any },
): // todo support `included` (relationships) property
Promise<{ data: JsonApiResource }> {
  const response = await fetch(url, {
    method,
    body: body ? JSON.stringify({ data: body }) : undefined,
  })

  if (!response.ok) {
    // todo proper validation
    throw Error("request failed")
  }

  if (response.status === 204) {
    return { data: {} as JsonApiResource }
  }

  return response.json()
}

/**
 * Helper function to transform the fields array from rest-client into a JSON:API
 * compliant query parameter.
 * * fieldsToQueryParam(schemaMap, allSchemas, "Book", ["title", "author.name", "illustrators.email"])
 * * returns: "fields[book_type]=title&fields[person_type]=name,email"
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

export function includeToQueryParam(includes: Include): string {
  return `include=${includes.join(",")}`
}

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
  const includeParam = includeToQueryParam(include)

  if (include.length) params += `?${includeParam}&`
  else if (fields.length) params += `?include=`

  params += fieldsParam

  return params
}

export function jsonApiResourceToRecord(
  resource: JsonApiResource,
  schemaName: string,
): Resource {
  return {
    attributes: resource.attributes,
    // todo relationships
    id: resource.id.toString(),
    __schema: schemaName,
  }
}

export function convertToRecords(
  data: JsonApiResource | JsonApiResource[],
  schemaName: string,
): Resource[] {
  if (Array.isArray(data)) {
    return data.map((d) => jsonApiResourceToRecord(d, schemaName))
  }
  return [jsonApiResourceToRecord(data, schemaName)]
}
