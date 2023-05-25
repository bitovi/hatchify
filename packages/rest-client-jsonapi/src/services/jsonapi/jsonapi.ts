import type { Source, SchemaMap, Resource } from "@hatchifyjs/rest-client"
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
    getList: (schema, query) => getList(config, schema, query),
    getOne: (schema, query) => getOne(config, schema, query),
    createOne: (schema, data) => createOne(config, schema, data),
    updateOne: (schema, data) => updateOne(config, schema, data),
    deleteOne: (schema, id) => deleteOne(config, schema, id),
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
