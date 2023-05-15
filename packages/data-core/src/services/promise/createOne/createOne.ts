import type { CreateData, Source, Record } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Creates a new resource in the data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const createOne = async (
  dataSource: Source,
  schema: string,
  data: CreateData, // @todo Resource or Record?
): Promise<Record> => {
  const response = await dataSource.createOne(schema, data)

  insert(schema, [response.data])

  return convertResourceToRecord(response.data)
}
