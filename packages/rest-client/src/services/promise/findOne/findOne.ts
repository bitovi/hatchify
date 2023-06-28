import type { Source, Record, QueryOne, Schemas } from "../../types"
import { flattenResourcesIntoRecords, getFields } from "../../utils"

/**
 * Fetches a single resource from a data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const findOne = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryOne | string,
): Promise<Record | undefined> => {
  const queryObj = typeof query === "string" ? { id: query } : { ...query }
  const updatedQuery = {
    ...queryObj,
    fields: getFields(allSchemas, schemaName, queryObj),
  } as Required<QueryOne>

  const resources = await dataSource.findOne(
    allSchemas,
    schemaName,
    updatedQuery,
  )

  return flattenResourcesIntoRecords(
    allSchemas,
    resources,
    schemaName,
    queryObj.id,
  )
}
