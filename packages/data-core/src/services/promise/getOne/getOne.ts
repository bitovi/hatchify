import type { Source, Record, QueryOne, Schema } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Fetches a single resource from a data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const getOne = async (
  dataSource: Source,
  schema: Schema,
  query: QueryOne,
): Promise<Record> => {
  const resources = await dataSource.getOne(schema, query)

  insert(schema.name, resources)

  // todo flatten related records into base records
  return convertResourceToRecord(resources[0])
}
