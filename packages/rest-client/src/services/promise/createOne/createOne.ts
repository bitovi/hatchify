import type { CreateData, Schemas, Source, Record } from "../../types"
import { notifySubscribers } from "../../store"
import { flattenResourcesIntoRecords } from "../../utils"

/**
 * Creates a new resource in the data source, notifies subscribers,
 * and returns it as a record.
 */
export const createOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  data: Omit<CreateData, "type">, // todo: Resource or Record?
): Promise<Record> => {
  const createData = {
    ...data,
    type: schemaName,
  }

  const resources = await dataSource.createOne(
    allSchemas,
    schemaName,
    createData,
  )

  notifySubscribers(schemaName)

  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
