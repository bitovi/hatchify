import type {
  Resource,
  Schema,
  SourceConfig,
  UpdateData,
} from "@hatchifyjs/rest-client"
import { convertToRecords, fetchJsonApi } from "../jsonapi"

/**
 * Updates a resource, adds the __schema to the request response,
 * and returns it.
 */
export async function updateOne(
  config: SourceConfig,
  schema: Schema,
  data: UpdateData,
): Promise<Resource[]> {
  const json = await fetchJsonApi(
    "PATCH",
    `${config.baseUrl}/${config.schemaMap[schema.name].endpoint}/${data.id}`,
    data,
  )

  return Promise.resolve(convertToRecords(json.data, schema.name))
}
