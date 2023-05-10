import type { CreateData, Source, Record, QueryList, QueryOne } from "../types"
import { convertResourceToRecord, insert } from "../store"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const getList = async (
  dataSource: Source,
  schema: string,
  query: QueryList,
): Promise<Record[]> => {
  const response = await dataSource.getList(schema, query)

  insert(schema, response.data)

  return response.data.map(convertResourceToRecord)
}

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
