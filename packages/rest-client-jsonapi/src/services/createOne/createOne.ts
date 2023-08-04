import type {
  CreateData,
  Schemas,
  SourceConfig,
  Resource,
} from "@hatchifyjs/rest-client"
import { convertToHatchifyResources, fetchJsonApi } from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne(
  config: SourceConfig,
  allSchemas: Schemas, // Unused; can we remove?
  schemaName: string,
  data: CreateData,
): Promise<Resource[]> {
  const jsonApiResource = hatchifyResourceToJsonApiResource(
    config,
    schemaName,
    data,
  )

  const json = await fetchJsonApi<JsonApiResource>(
    "POST",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}`,
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
  hatchifyResource: CreateData,
): JsonApiResource {
  const jsonApiResource = { ...hatchifyResource }
  jsonApiResource.type = config.schemaMap[schemaName].type
  delete jsonApiResource.__schema

  return jsonApiResource as JsonApiResource
}
