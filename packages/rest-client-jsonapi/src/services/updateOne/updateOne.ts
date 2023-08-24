import type {
  Resource,
  RestClientUpdateData,
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
 * Updates a resource, adds the __schema to the request response,
 * and returns it.
 */
export async function updateOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  data: RestClientUpdateData,
): Promise<Resource[]> {
  const jsonApiResource = hatchifyResourceToJsonApiResource(
    config,
    allSchemas[schemaName],
    schemaName,
    data,
  )

  const json = await fetchJsonApi<JsonApiResource>(
    "PATCH",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${
      "id" in jsonApiResource ? jsonApiResource.id : null
    }`,
    jsonApiResource,
  )

  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}
