import type { PartialSchema } from "@hatchifyjs/core"
import type {
  Source,
  GetSchemaNames,
  FinalSchemas,
  CreateType,
  GetSchemaFromName,
  RecordType,
} from "../../types"
import { notifySubscribers } from "../../store"
import {
  SchemaNameNotStringError,
  flattenResourcesIntoRecords,
  schemaNameIsString,
  serializeClientPropertyValuesForRequest,
} from "../../utils"

/**
 * Creates a new resource in the data source, notifies subscribers,
 * and returns it as a record.
 */
export const createOne = async <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  data: Omit<
    CreateType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>,
    "__schema"
  >,
): Promise<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const resources = await dataSource.createOne(allSchemas, schemaName, {
    __schema: schemaName,
    attributes: serializeClientPropertyValuesForRequest(
      allSchemas,
      schemaName,
      data,
    ),
  })

  notifySubscribers()

  // @ts-expect-error return from `flattenResourcesIntoRecords` needs to be `RecordType`
  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
