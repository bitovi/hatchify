import type {
  Schemas,
  SourceConfig,
  Resource,
  RestClientCreateData,
  Schema,
} from "@hatchifyjs/rest-client"
import {
  convertToHatchifyResources,
  fetchJsonApi,
  convertToJsonApiRelationships,
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
  const jsonApiResource = restClientCreateDataToJsonApiResource(
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
function restClientCreateDataToJsonApiResource(
  config: SourceConfig,
  schema: Schema,
  schemaName: string,
  hatchifyResource: RestClientCreateData,
): Omit<JsonApiResource, "id"> {
  const { attributes, relationships } = hatchifyResource

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
    type: config.schemaMap[schemaName].type,
    attributes,
    ...translatedRelationships,
  }
}
