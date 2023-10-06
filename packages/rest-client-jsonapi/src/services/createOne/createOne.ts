import type {
  Resource,
  RestClientCreateData,
  Schemas,
  SourceConfig,
} from "@hatchifyjs/rest-client"
import {
  convertToHatchifyResources,
  fetchJsonApi,
  hatchifyResourceToJsonApiResource,
} from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  data: RestClientCreateData,
): Promise<Resource[]> {
  const jsonApiResource = hatchifyResourceToJsonApiResource(
    config,
    allSchemas[schemaName],
    schemaName,
    data,
  )

  const json = await fetchJsonApi<JsonApiResource>(
    "POST",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}`,
    jsonApiResource,
  )
  console.log("🟧", json)
  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}
