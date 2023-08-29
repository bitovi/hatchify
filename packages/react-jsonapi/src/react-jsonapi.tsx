import createClient from "@hatchifyjs/rest-client-jsonapi"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import { PartialSchemas } from "@hatchifyjs/rest-client"

interface SourceSchema {
  type?: string
  endpoint: string
}
export type SchemaMap = Record<string, SourceSchema>

export function reactJsonapi<TSchemas extends PartialSchemas>(
  partialSchemas: TSchemas,
  baseUrl: string,
  schemaMap: SchemaMap,
): HatchifyReactRest<TSchemas> {
  const jsonapiClient = createClient(baseUrl, schemaMap)

  return hatchifyReactRest(partialSchemas, jsonapiClient)
}
