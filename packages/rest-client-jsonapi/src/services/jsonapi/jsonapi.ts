import type {
  CreateData,
  Schema,
  Source,
  SourceConfig,
  QueryList,
  QueryOne,
  Resource,
} from "@hatchifyjs/rest-client"
import { createOne, getList, getOne } from ".."

export interface JsonApiResource {
  id: string | number
  type: string
  attributes?: { [key: string]: string | number | boolean | null }
  // todo relationships
}

/**
 * Creates a new JSON:API Source.
 */
export function jsonapi(config: SourceConfig): Source {
  return {
    version: 0,
    getList: (schema: Schema, query: QueryList) =>
      getList(config, schema, query),
    getOne: (schema: Schema, query: QueryOne) => getOne(config, schema, query),
    createOne: (schema: Schema, data: CreateData) =>
      createOne(config, schema, data),
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
