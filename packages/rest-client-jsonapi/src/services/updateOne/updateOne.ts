import type {
  Resource,
  Schemas,
  SourceConfig,
  UpdateData,
} from "@hatchifyjs/rest-client"
import { convertToHatchifyResources, fetchJsonApi } from "../utils"
import type { JsonApiResource } from "../jsonapi"

/**
 * Updates a resource, adds the __schema to the request response,
 * and returns it.
 */
export async function updateOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  data: Omit<UpdateData, "type">,
): Promise<Resource[]> {
  const updateData = {
    ...data,
    type: schemaName,
  }

  const json = await fetchJsonApi<JsonApiResource>(
    "PATCH",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${updateData.id}`,
    updateData,
  )

  return Promise.resolve(
    convertToHatchifyResources(
      [json.data, ...(json.included || [])],
      config.schemaMap,
    ),
  )
}
