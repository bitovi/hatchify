import type {
  Schemas,
  SourceConfig,
  QueryList,
  Resource,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi } from "../jsonapi"

/**
 * Fetches a list of resources, adds the __schema to each resource, and
 * returns them.
 */
export async function getList(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList, // todo page, sort, and filter
): Promise<Resource[]> {
  const json = await fetchJsonApi(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}`,
  )
  // todo: flattening relationships

  return Promise.resolve(convertToRecords(json.data, schemaName))
}
