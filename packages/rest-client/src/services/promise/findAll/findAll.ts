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
import { SchemaNameNotStringError, schemaNameIsString } from "../../utils"
import { flattenResourcesIntoRecords } from "../../utils/records"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const findAll = async <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList<GetSchemaFromName<TSchemas, TSchemaName>>,
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

  // todo: HATCH-417; return from `findAll` needs to be a typed `Resource` using generics
  const [resources, requestMetaData] = await dataSource.findAll(
    allSchemas,
    schemaName,
    query,
    baseFilter,
  )

  return [
    // todo: HATCH-417; return from `flattenResourcesIntoRecords` needs to be `RecordType`
    // @ts-expect-error
    flattenResourcesIntoRecords(
      allSchemas,
      resources.records,
      resources.related,
    ),
    requestMetaData,
  ]
}
