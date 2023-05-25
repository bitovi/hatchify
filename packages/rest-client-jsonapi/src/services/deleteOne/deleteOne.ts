import type { Schema, SourceConfig } from "@hatchifyjs/rest-client"
import { fetchJsonApi } from "../jsonapi"

/**
 * Deletes a resource.
 */
export async function deleteOne(
  config: SourceConfig,
  schema: Schema, // todo might be needed for url in future changes
  id: string,
): Promise<void> {
  await fetchJsonApi(
    "DELETE",
    `${config.baseUrl}/${config.schemaMap[schema.name].endpoint}/${id}`,
  )

  return Promise.resolve()
}
