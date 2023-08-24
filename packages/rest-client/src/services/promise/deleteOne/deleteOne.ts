import type { Schemas, Source } from "../../types"
import { notifySubscribers } from "../../store"

/**
 * Deletes a resource in the data source and notifies subscribers.
 */
export const deleteOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  id: string,
): Promise<void> => {
  await dataSource.deleteOne(allSchemas, schemaName, id)

  notifySubscribers()

  return
}
