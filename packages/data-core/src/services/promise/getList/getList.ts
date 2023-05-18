import type { Source, Record, QueryList, Schema } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const getList = async (
  dataSource: Source,
  schema: Schema,
  query: QueryList,
): Promise<Record[]> => {
  const resources = await dataSource.getList(schema, query)

  insert(schema.name, resources)

  // todo flatten related records into base records
  return resources.map(convertResourceToRecord)
}
