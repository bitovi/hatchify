import type { Schemas, Source } from "../../types"
import { remove, notifySubscribers } from "../../store"

/**
 * Deletes a resource in the data source, updates the store,
 * and notifies subscribers.
 */
export const deleteOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  id: string,
): Promise<void> => {
  await dataSource.deleteOne(allSchemas, schemaName, id)
  notifySubscribers(schemaName)
  // remove(schemaName, [id])

  return
}
