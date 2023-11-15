import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaNames,
  SourceConfig,
} from "@hatchifyjs/rest-client"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
} from "@hatchifyjs/rest-client"
import { fetchJsonApi } from "../utils"

/**
 * Deletes a resource.
 */
export async function deleteOne<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  config: SourceConfig,
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
