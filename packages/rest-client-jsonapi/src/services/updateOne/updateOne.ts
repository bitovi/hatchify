import type {
  Resource,
  Schemas,
  SourceConfig,
  UpdateData,
} from "@hatchifyjs/rest-client"
import { convertToHatchifyResources, fetchJsonApi } from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Updates a resource, adds the __schema to the request response,
 * and returns it.
 */
export async function updateOne(
  config: SourceConfig,
  allSchemas: Schemas, // Unused; can we remove?
  schemaName: string,
  data: UpdateData,
): Promise<Resource[]> {
  const jsonApiResource = hatchifyResourceToJsonApiResource(
    config,
    schemaName,
    data,
  )

  const json = await fetchJsonApi<JsonApiResource>(
    "PATCH",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${jsonApiResource.id}`,
    jsonApiResource,
  )

  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}

function hatchifyResourceToJsonApiResource(
  config: SourceConfig,
  schemaName: string,
  hatchifyResource: UpdateData,
): JsonApiResource {
  const jsonApiResource = { ...hatchifyResource }
  jsonApiResource.type = config.schemaMap[schemaName].type
  delete jsonApiResource.__schema

  return jsonApiResource as JsonApiResource
}
