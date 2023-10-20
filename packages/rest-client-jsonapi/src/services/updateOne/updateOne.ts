import type {
  FinalSchemas,
  Resource,
  RestClientUpdateData,
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
  config: SourceConfig, // todo: HATCH-417
  allSchemas: FinalSchemas,
  schemaName: string,
  data: RestClientUpdateData,
): Promise<Resource[] | null> {
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

  if (!json.data) {
    return Promise.resolve(null)
  }

  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}
