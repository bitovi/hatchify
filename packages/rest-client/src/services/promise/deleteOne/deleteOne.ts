import type { PartialSchema } from "@hatchifyjs/core"
import type { FinalSchemas, GetSchemaNames, Source } from "../../types"
import { notifySubscribers } from "../../store"
import { SchemaNameNotStringError, schemaNameIsString } from "../../utils"

/**
 * Deletes a resource in the data source and notifies subscribers.
 */
export const deleteOne = async <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  id: string,
): Promise<void> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  await dataSource.deleteOne(allSchemas, schemaName, id)

  notifySubscribers()

  return
}
