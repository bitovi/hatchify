import type { PartialSchema } from "@hatchifyjs/core"
import type {
  CreateType,
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Resource,
  RestClientConfig,
} from "@hatchifyjs/rest-client"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
} from "@hatchifyjs/rest-client"
import {
  convertToHatchifyResources,
  fetchJsonApi,
  hatchifyResourceToJsonApiResource,
} from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  config: RestClientConfig, // todo: HATCH-417
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  data: CreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
): Promise<{ record: Resource; related: Resource[] }> {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const jsonApiResource = hatchifyResourceToJsonApiResource(
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

  return Promise.resolve({
    // @todo: remove this [0]
    record: convertToHatchifyResources(json.data, config.schemaMap)[0],
    related: convertToHatchifyResources(json.included || [], config.schemaMap),
  })
}
