import { PartialSchema } from "@hatchifyjs/hatchify-core"
import type {
  Source,
  QueryList,
  RequestMetaData,
  GetSchemaNames,
  GetSchemaFromName,
  RecordType,
  FinalSchemas,
} from "../../types"
import { flattenResourcesIntoRecords } from "../../utils"

/**
 * Fetches a list of resources from a data source, inserts them into the store,
 * notifies subscribers, and returns them as records.
 */
export const findAll = async <
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList,
): Promise<
  [RecordType<GetSchemaFromName<TSchemas, TSchemaName>>[], RequestMetaData]
> => {
  if (typeof schemaName !== "string") {
    throw new Error(
      `Expected schemaName to be a string, received ${typeof schemaName}`,
    )
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
