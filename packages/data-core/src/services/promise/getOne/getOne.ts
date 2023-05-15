import type { Source, Record, QueryOne } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Fetches a single resource from a data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const getOne = async (
  dataSource: Source,
  schema: string,
  query: QueryOne,
): Promise<Record> => {
  const response = await dataSource.getOne(schema, query)

  insert(schema, [response.data])

  return convertResourceToRecord(response.data)
}
