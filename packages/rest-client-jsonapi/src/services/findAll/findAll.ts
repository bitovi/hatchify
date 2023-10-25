import type {
  Filters,
  QueryList,
  RequestMetaData,
  Resource,
  SourceConfig,
  FinalSchemas,
  GetSchemaNames,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
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
export async function findAll<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  config: SourceConfig,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList,
  baseFilter?: Filters,
): Promise<[Resources: Resource[], Meta: RequestMetaData]> {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

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
