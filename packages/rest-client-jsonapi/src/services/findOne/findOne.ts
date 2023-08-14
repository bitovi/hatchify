import type {
  SourceConfig,
  QueryOne,
  Resource,
  Schemas,
} from "@hatchifyjs/rest-client"
import {
  convertToHatchifyResources,
  fetchJsonApi,
  getQueryParams,
} from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Fetches a single resource, adds the __schema to the request response,
 * and returns it.
 */
export async function findOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryOne,
): Promise<Resource[]> {
  const queryParams = getQueryParams(config.schemaMap, allSchemas, schemaName, {
    fields: query.fields,
    include: query.include,
  })

  const json = await fetchJsonApi<JsonApiResource>(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${query.id}${queryParams}`,
  )

  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}
