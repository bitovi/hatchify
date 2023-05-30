import type { Source, Record, QueryList, Schemas } from "../../types"
import { getFields } from "../../types"
import { convertResourceToRecord, insert } from "../../store"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const findAll = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
): Promise<Record[]> => {
  const updatedQuery = {
    ...query,
    fields: getFields(allSchemas, schemaName, query),
  } as Required<QueryList>

  const resources = await dataSource.findAll(
    allSchemas,
    schemaName,
    updatedQuery,
  )

  insert(schemaName, resources)

  // todo: flatten related records into base records
  return resources.map(convertResourceToRecord)
}
