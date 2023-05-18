import type {
  Schema,
  SourceConfig,
  QueryList,
  Resource,
} from "@hatchifyjs/data-core"
import { convertToRecords, fetchJsonApi } from "../jsonapi"

/**
 * Fetches a list of resources, adds the __schema to each resource, and
 * returns them.
 */
export async function getList(
  config: SourceConfig,
  schema: Schema,
  query: QueryList, // todo query for fields, page, sort, and filter
): Promise<Resource[]> {
  const json = await fetchJsonApi("GET", config.url)
  // todo relationships: json.included

  return Promise.resolve(convertToRecords(json.data, schema.name))
}
