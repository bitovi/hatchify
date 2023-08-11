import type {
  Resource,
  RestClientUpdateData,
  Schema,
  Schemas,
  SourceConfig,
} from "@hatchifyjs/rest-client"
import {
  convertToHatchifyResources,
  fetchJsonApi,
  convertToJsonApiRelationships,
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
  const jsonApiResource = restClientUpdateDataToJsonApiResource(
    config,
    allSchemas[schemaName],
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

/**
 * Converts a Hatchify resource into a JSON:API resource.
 */
function restClientUpdateDataToJsonApiResource(
  config: SourceConfig,
  schema: Schema,
  schemaName: string,
  hatchifyResource: RestClientUpdateData,
): JsonApiResource {
  const { attributes, relationships, id } = hatchifyResource

  const translatedRelationships = relationships
    ? {
        relationships: convertToJsonApiRelationships(
          config,
          schema,
          relationships,
        ),
      }
    : null

  return {
    id,
    type: config.schemaMap[schemaName].type,
    attributes,
    ...translatedRelationships,
  }
}
