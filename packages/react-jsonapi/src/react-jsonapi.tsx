import createClient from "@hatchifyjs/rest-client-jsonapi"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import type { ReactRest, SchemaRecord } from "@hatchifyjs/react-rest"

interface SourceSchema {
  type?: string
  endpoint: string
}
export type SchemaMap = Record<string, SourceSchema>

export function reactJsonapi(
  schema: SchemaRecord,
  baseUrl: string,
): ReactRest<SchemaRecord> {
  const jsonapiClient = createClient(baseUrl, schema)

  return hatchifyReactRest(schema, jsonapiClient)
}
