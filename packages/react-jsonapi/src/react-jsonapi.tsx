import createClient from "@hatchifyjs/rest-client-jsonapi"
import hatchifyReactRest from "@hatchifyjs/react-rest"
import type { HatchifyReactRest } from "@hatchifyjs/react-rest"
import type { PartialSchema } from "@hatchifyjs/core"

export function reactJsonapi<TSchemas extends Record<string, PartialSchema>>(
  partialSchemas: TSchemas,
  baseUrl: string,
): HatchifyReactRest<TSchemas> {
  const jsonapiClient = createClient(baseUrl, partialSchemas)

  return hatchifyReactRest(jsonapiClient)
}
