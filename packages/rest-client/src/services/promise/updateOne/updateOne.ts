import type { PartialSchema } from "@hatchifyjs/core"
import type {
  RestClient,
  GetSchemaNames,
  FinalSchemas,
  UpdateType,
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
 * Updates a resource in the data source, notifies subscribers,
 * and returns it as a record.
 */
export const updateOne = async <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  data: Omit<
    UpdateType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>,
    "__schema"
  >,
): Promise<RecordType<
  TSchemas,
  GetSchemaFromName<TSchemas, TSchemaName>
> | null> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const resources = await dataSource.updateOne(allSchemas, schemaName, {
    __schema: schemaName,
    id: data.id,
    attributes: serializeClientPropertyValuesForRequest(
      allSchemas,
      schemaName,
      data,
    ),
  })

  notifySubscribers()

  if (!resources) {
    return null
  }

  // @ts-expect-error return from `flattenResourcesIntoRecords` needs to be `RecordType`
  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
