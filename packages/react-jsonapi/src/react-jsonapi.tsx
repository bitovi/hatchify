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
  schemaMap: SchemaMap,
): ReactRest<SchemaRecord> {
  const jsonapiClient = createJsonapiClient(
    "http://localhost:3000/api",
    schemaMap,
  )

  return hatchifyReactRest(schema, jsonapiClient)
}
