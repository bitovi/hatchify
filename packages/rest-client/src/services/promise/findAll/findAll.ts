import type {
  Source,
  Record,
  QueryList,
  Schemas,
  RequestMetaData,
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
): Promise<[Records: Record[], RequestMetaData: RequestMetaData]> => {
  const updatedQuery = {
    ...query,
    // todo: arthur, the include & field should be inferred from each other at the rest-client-* level
    // otherwise both will be used in the query, which is not correct
    include: query.include || [],
    fields: query.fields || [],
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
