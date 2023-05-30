import type {
  SourceConfig,
  QueryOne,
  Resource,
  Schemas,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi, getQueryParams } from "../jsonapi"

/**
 * Fetches a single resource, adds the __schema to the request response,
 * and returns it.
 */
export async function getOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  query: Required<QueryOne>,
): Promise<Resource[]> {
  const queryParams = getQueryParams(
    config.schemaMap,
    allSchemas,
    schemaName,
    query.fields,
    query.include,
  )

  const json = await fetchJsonApi(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${query.id}${queryParams}`,
  )

  return Promise.resolve(convertToRecords(json.data, schemaName))
}
