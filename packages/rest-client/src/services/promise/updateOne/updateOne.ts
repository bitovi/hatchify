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
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  data: Omit<UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">,
): Promise<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const resources = await dataSource.updateOne(allSchemas, schemaName, {
    __schema: schemaName,
    id: data.id,
    attributes: data?.attributes
      ? (serializeClientPropertyValuesForRequest(
          allSchemas,
          schemaName,
          data.attributes,
        ) as UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>["attributes"])
      : undefined,
    // does not need to be serialized! only ids, does not contain attribute values
    relationships: data?.relationships || undefined,
  })

  notifySubscribers()

  // @ts-expect-error return from `flattenResourcesIntoRecords` needs to be `RecordType`
  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
