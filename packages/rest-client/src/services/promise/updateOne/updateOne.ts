import type { Schemas, Source, Record, UpdateData } from "../../types"
import { flattenResourcesIntoRecords, notifySubscribers } from "../../store"

/**
 * Updates a resource in the data source, notifies subscribers,
 * and returns it as a record.
 */
export const updateOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  data: UpdateData, // todo: Resource or Record?
): Promise<Record> => {
  const resources = await dataSource.updateOne(allSchemas, schemaName, data)

  notifySubscribers(schemaName)

  return flattenResourcesIntoRecords(resources, schemaName)[0]
}
