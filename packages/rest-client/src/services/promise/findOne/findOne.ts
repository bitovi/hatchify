import type { PartialSchema } from "@hatchifyjs/core"
import type {
  RestClient,
  QueryOne,
  GetSchemaNames,
  RecordType,
  GetSchemaFromName,
  FinalSchemas,
} from "../../types/index.js"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
  flattenResourcesIntoRecords,
} from "../../utils/index.js"

/**
 * Fetches a single resource from a data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const findOne = async <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryOne<GetSchemaFromName<TSchemas, TSchemaName>> | string,
): Promise<
  RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>> | undefined
> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const updatedQuery = typeof query === "string" ? { id: query } : { ...query }

  // todo: HATCH-417; return from `findAll` needs to be a typed `Resource` using generics
  const resources = await dataSource.findOne(
    allSchemas,
    schemaName,
    updatedQuery,
  )

  // todo: HATCH-417; return from `flattenResourcesIntoRecords` needs to be `RecordType`
  // @ts-expect-error
  return flattenResourcesIntoRecords(
    allSchemas,
    resources.record,
    resources.related,
  )
}
