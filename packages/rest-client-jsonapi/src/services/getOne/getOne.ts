import type {
  Schema,
  SourceConfig,
  QueryOne,
  Resource,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi } from "../jsonapi"

/**
 * Fetches a single resource, adds the __schema to the request response,
 * and returns it.
 */
export async function getOne(
  config: SourceConfig,
  schema: Schema,
  query: QueryOne,
): Promise<Resource[]> {
  const json = await fetchJsonApi(
    "GET",
    `${config.baseUrl}/${config.schemaMap[schema.name].endpoint}/${query.id}`,
  )
  // todo relationships: json.included

  return Promise.resolve(convertToRecords(json.data, schema.name))
}
