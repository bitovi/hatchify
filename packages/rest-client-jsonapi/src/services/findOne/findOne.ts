import type {
  RestClientConfig,
  QueryOne,
  Resource,
  FinalSchemas,
  GetSchemaNames,
  GetSchemaFromName,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import {
  schemaNameIsString,
  SchemaNameNotStringError,
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
export async function findOne<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  config: RestClientConfig,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryOne<GetSchemaFromName<TSchemas, TSchemaName>>,
): Promise<{ record: Resource; related: Resource[] }> {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const queryParams = getQueryParams(config.schemaMap, allSchemas, schemaName, {
    fields: query.fields,
    include: query.include,
  })

  const json = await fetchJsonApi<JsonApiResource>(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${query.id}${queryParams}`,
  )

  return Promise.resolve({
    // @todo: remove this [0]
    record: convertToHatchifyResources(json.data, config.schemaMap)[0],
    related: convertToHatchifyResources(json.included || [], config.schemaMap),
  })
}
