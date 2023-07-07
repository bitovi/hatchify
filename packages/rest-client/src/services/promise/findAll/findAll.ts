import type {
  Source,
  Record,
  QueryList,
  Schemas,
  RequestMetaData,
} from "../../types"
import { flattenResourcesIntoRecords, getFields, getInclude } from "../../utils"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const findAll = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
): Promise<[Records: Record[], RequestMetaData: RequestMetaData]> => {
  const updatedQuery = {
    ...query,
    include: getInclude(allSchemas, schemaName, query),
    fields: getFields(allSchemas, schemaName, query),
  } as Required<QueryList>

  const [resources, requestMetaData] = await dataSource.findAll(
    allSchemas,
    schemaName,
    updatedQuery,
  )

  return [
    flattenResourcesIntoRecords(allSchemas, resources, schemaName),
    requestMetaData,
  ]
}
