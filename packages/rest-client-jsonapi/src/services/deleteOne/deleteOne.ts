import type { Schemas, SourceConfig } from "@hatchifyjs/rest-client"
import { fetchJsonApi } from "../utils"

/**
 * Deletes a resource.
 */
export async function deleteOne(
  config: SourceConfig,
  allSchemas: Schemas,
  schemaName: string,
  id: string,
): Promise<void> {
  await fetchJsonApi(
    "DELETE",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${id}`,
  )

  return Promise.resolve()
}
