import type { CreateData, Schemas, Source, Record } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Creates a new resource in the data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const createOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  data: CreateData, // todo: Resource or Record?
): Promise<Record> => {
  const resources = await dataSource.createOne(allSchemas, schemaName, data)

  insert(schemaName, resources)

  // todo: flatten related records into base records
  return convertResourceToRecord(resources[0])
}
