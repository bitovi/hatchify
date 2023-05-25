import type { Schema, Source, Record, UpdateData } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Updates a resource in the data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const updateOne = async (
  dataSource: Source,
  schema: Schema,
  data: UpdateData, // @todo Resource or Record?
): Promise<Record> => {
  const resources = await dataSource.updateOne(schema, data)

  insert(schema.name, resources)

  // todo flatten related records into base records
  return convertResourceToRecord(resources[0])
}
