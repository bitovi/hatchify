import type { Schemas, Source, Record, UpdateData } from "../../types"
import { notifySubscribers } from "../../store"
import { flattenResourcesIntoRecords } from "../../utils"

/**
 * Updates a resource in the data source, notifies subscribers,
 * and returns it as a record.
 */
export const updateOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  data: UpdateData, // todo: Resource or Record?
): Promise<Record | null> => {
  const resources = await dataSource.updateOne(allSchemas, schemaName, data)

  notifySubscribers()

  if (!resources) return null

  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
