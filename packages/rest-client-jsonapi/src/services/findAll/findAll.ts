import type {
  Schemas,
  SourceConfig,
  QueryList,
  Resource,
  RequestMetaData,
  Filters,
} from "@hatchifyjs/rest-client"
import type { JsonApiResource } from "../jsonapi"
import {
  convertToHatchifyResources,
  fetchJsonApi,
  getQueryParams,
} from "../utils"

/**
 * Fetches a list of resources, adds the __schema to each resource, and
 * returns them.
 */
export async function findAll(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
  baseFilter?: Filters,
): Promise<[Resources: Resource[], Meta: RequestMetaData]> {
  console.log("⚪", baseFilter)
  const queryParams = getQueryParams(
    config.schemaMap,
    allSchemas,
    schemaName,
    {
      fields: query.fields,
      include: query.include,
      sort: query.sort,
      filter: query.filter,
      page: query.page,
    },
    baseFilter,
  )

  const json = await fetchJsonApi<JsonApiResource[]>(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}${queryParams}`,
  )

  return Promise.resolve([
    convertToHatchifyResources(
      [...json.data, ...(json.included || [])],
      config.schemaMap,
    ),
    json.meta,
  ])
}
