import type { CreateData, Schema, Source, Record } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Creates a new resource in the data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const createOne = async (
  dataSource: Source,
  schema: Schema,
  data: CreateData, // @todo Resource or Record?
): Promise<Record> => {
  const response = await dataSource.createOne(schema, data)

  insert(schema.name, [response.data])

  return convertResourceToRecord(response.data)
}
