import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaNames,
  RestClientConfig,
} from "@hatchifyjs/rest-client"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
} from "@hatchifyjs/rest-client"
import { fetchJsonApi } from "../utils/index.js"

/**
 * Deletes a resource.
 */
export async function deleteOne<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  config: RestClientConfig,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  id: string,
): Promise<void> {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  await fetchJsonApi(
    "DELETE",
    `${config.baseUrl}/${config.schemaMap[schemaName].endpoint}/${id}`,
  )

  return Promise.resolve()
}
