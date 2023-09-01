import type {
  Source,
  Record,
  QueryOne,
  Schemas,
  PartialSchemas,
  GetSchemaNames,
  RecordType,
  GetSchemaFromName,
  FinalSchemas,
} from "../../types"
import { flattenResourcesIntoRecords } from "../../utils"

/**
 * Fetches a single resource from a data source, inserts it into the store,
 * notifies subscribers, and returns it as a record.
 */
export const findOne = async <
  const TSchemas extends PartialSchemas,
  const TSchemaName extends GetSchemaNames<TSchemas> | string,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryOne | string,
): Promise<
  RecordType<GetSchemaFromName<TSchemas, TSchemaName>> | undefined
> => {
  if (typeof schemaName !== "string") {
    throw new Error(
      `Expected schemaName to be a string, received ${typeof schemaName}`,
    )
  }

  const updatedQuery = typeof query === "string" ? { id: query } : { ...query }

  const resources = await dataSource.findOne(
    allSchemas,
    schemaName,
    updatedQuery,
  )

  // @ts-expect-error return from `flattenResourcesIntoRecords` needs to be `RecordType`
  return flattenResourcesIntoRecords(
    allSchemas,
    resources,
    schemaName,
    updatedQuery.id,
  )
}
