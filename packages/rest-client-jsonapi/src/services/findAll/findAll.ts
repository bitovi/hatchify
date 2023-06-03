import type {
  Schemas,
  SourceConfig,
  QueryList,
  Resource,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi, getQueryParams } from "../utils"

/**
 * Fetches a list of resources, adds the __schema to each resource, and
 * returns them.
 */
export async function findAll(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  query: Required<QueryList>, // todo page, sort, and filter
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
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}${queryParams}`,
  )
  // todo: flattening relationships

  console.log("json.data", json.data)

  return Promise.resolve(convertToRecords(json.data, schemaName))
}
