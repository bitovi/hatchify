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
  const response = await dataSource.getList(schema, query)

  insert(schema.name, response.data)

  return response.data.map(convertResourceToRecord)
}
