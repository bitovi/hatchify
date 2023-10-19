import type { PartialSchema } from "@hatchifyjs/core"
import type {
  RestClient,
  QueryList,
  RequestMetaData,
  GetSchemaNames,
  GetSchemaFromName,
  RecordType,
  FinalSchemas,
  Filters,
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
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList,
  baseFilter?: Filters,
): Promise<
  [
    Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>>,
    RequestMetaData,
  ]
> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const [resources, requestMetaData] = await dataSource.findAll(
    allSchemas,
    schemaName,
    query,
    baseFilter,
  )

  return [
    // @ts-expect-error todo: HATCH-417; return from `flattenResourcesIntoRecords` needs to be `RecordType`
    flattenResourcesIntoRecords(allSchemas, resources, schemaName),
    requestMetaData,
  ]
}
