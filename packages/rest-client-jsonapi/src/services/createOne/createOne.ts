import type {
  CreateData,
  Schemas,
  SourceConfig,
  Resource,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi } from "../utils"

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  data: CreateData,
): Promise<Resource[]> {
  const json = await fetchJsonApi(
    "POST",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}`,
    data,
  )
  // todo: relationships

  return Promise.resolve(convertToRecords(json.data, schemaName))
}
