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
  data: Omit<UpdateData, "type">, // todo: Resource or Record?
): Promise<Record> => {
  const updateData = {
    ...data,
    type: schemaName,
  }

  const resources = await dataSource.updateOne(
    allSchemas,
    schemaName,
    updateData,
  )

  notifySubscribers(schemaName)

  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
