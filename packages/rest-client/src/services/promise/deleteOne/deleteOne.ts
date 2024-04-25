import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaNames,
  MutateOptions,
  RestClient,
} from "../../types/index.js"
import { notifySubscribers } from "../../store/index.js"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
} from "../../utils/index.js"

/**
 * Deletes a resource in the data source and notifies subscribers.
 */
export const deleteOne = async <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  id: string,
  mutateOptions?: MutateOptions<TSchemas>,
): Promise<void> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  await dataSource.deleteOne(allSchemas, schemaName, id)

  notifySubscribers(schemaName, mutateOptions?.notify)

  return
}
