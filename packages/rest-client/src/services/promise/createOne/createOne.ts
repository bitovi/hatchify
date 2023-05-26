import type { CreateData, Schema, Source, Record } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Creates a new resource in the data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const createOne = async (
  dataSource: Source,
  schemas: globalThis.Record<string, Schema>, // todo: will be passed do dataSource in future
  schema: Schema,
  data: CreateData, // todo: Resource or Record?
): Promise<Record> => {
  const resources = await dataSource.createOne(schema, data)

  insert(schema.name, resources)

  // todo: flatten related records into base records
  return convertResourceToRecord(resources[0])
}
