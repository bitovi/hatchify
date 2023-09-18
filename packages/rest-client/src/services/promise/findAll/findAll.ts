import type {
  Source,
  Record,
  QueryList,
  Schemas,
  RequestMetaData,
  Filters,
} from "../../types"
import { flattenResourcesIntoRecords } from "../../utils"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const findAll = async (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
  baseFilter?: Filters,
): Promise<[Records: Record[], RequestMetaData: RequestMetaData]> => {
  const [resources, requestMetaData] = await dataSource.findAll(
    allSchemas,
    schemaName,
    query,
    baseFilter,
  )

  return [
    flattenResourcesIntoRecords(allSchemas, resources, schemaName),
    requestMetaData,
  ]
}
