import type {
  Source,
  QueryList,
  RequestMetaData,
  GetSchemaNames,
  GetSchemaFromName,
  RecordType,
  FinalSchemas,
  PartialSchemas,
} from "../../types"
import {
  SchemaNameNotStringError,
  flattenResourcesIntoRecords,
  schemaNameIsString,
} from "../../utils"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const findAll = async <
  const TSchemas extends PartialSchemas,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList,
): Promise<
  [Array<RecordType<GetSchemaFromName<TSchemas, TSchemaName>>>, RequestMetaData]
> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const [resources, requestMetaData] = await dataSource.findAll(
    allSchemas,
    schemaName,
    query,
  )

  return [
    // @ts-expect-error return from `flattenResourcesIntoRecords` needs to be `RecordType`
    flattenResourcesIntoRecords(allSchemas, resources, schemaName),
    requestMetaData,
  ]
}
