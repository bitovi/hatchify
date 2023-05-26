import type {
  SourceConfig,
  QueryOne,
  Resource,
  Schemas,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi } from "../jsonapi"

/**
 * Fetches a single resource, adds the __schema to the request response,
 * and returns it.
 */
export async function getOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryOne,
): Promise<Resource[]> {
  const json = await fetchJsonApi(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${query.id}`,
  )

  return Promise.resolve(convertToRecords(json.data, schemaName))
}
