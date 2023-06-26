import { jsonapi as createJsonapiClient } from "@hatchifyjs/rest-client-jsonapi"
import { hatchifyReactRest } from "@hatchifyjs/react-rest"
import type { ReactRest, SchemaRecord } from "@hatchifyjs/react-rest"

interface SourceSchema {
  type?: string
  endpoint: string
}
export type SchemaMap = Record<string, SourceSchema>

export function reactJsonapi(
  schema: SchemaRecord,
  baseUrl: string,
  schemaMap: SchemaMap,
): ReactRest<SchemaRecord> {
  const jsonapiClient = createJsonapiClient(baseUrl, schemaMap)

  return hatchifyReactRest(schema, jsonapiClient)
}
