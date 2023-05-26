import type { Schema, Source } from "../../types"
import { remove } from "../../store"

/**
 * Deletes a resource in the data source, updates the store,
 * and notifies subscribers.
 */
export const deleteOne = async (
  dataSource: Source,
  schemas: globalThis.Record<string, Schema>, // todo: will be passed do dataSource in future
  schema: Schema,
  id: string, // @todo Resource or Record?
): Promise<void> => {
  await dataSource.deleteOne(schema, id)

  remove(schema.name, [id])

  return
}
