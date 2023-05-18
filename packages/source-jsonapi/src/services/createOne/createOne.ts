import type {
  CreateData,
  Schema,
  SourceConfig,
  Resource,
} from "@hatchifyjs/data-core"
import { convertToRecords, fetchJsonApi } from "../jsonapi"

/**
 * Creates a new resource, adds the __schema to the request response,
 * and returns it.
 */
export async function createOne(
  config: SourceConfig,
  schema: Schema,
  data: CreateData,
): Promise<Resource[]> {
  const json = await fetchJsonApi("POST", config.url, data)
  // todo relationships: json.included

  return Promise.resolve(convertToRecords(json.data, schema.name))
}
