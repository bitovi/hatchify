import type { PartialSchema } from "@hatchifyjs/core"
import type {
  RestClient,
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
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  data: Omit<CreateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">,
): Promise<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const resources = await dataSource.createOne(allSchemas, schemaName, {
    __schema: schemaName,
    attributes: serializeClientPropertyValuesForRequest(
      allSchemas,
      schemaName,
      data.attributes,
    ) as CreateType<GetSchemaFromName<TSchemas, TSchemaName>>["attributes"],
    // does not need to be serialized! only ids, does not contain attribute values
    relationships: data.relationships,
  })

  notifySubscribers()

  // @ts-expect-error todo HATCH-417; return from `flattenResourcesIntoRecords` needs to be `RecordType`
  return flattenResourcesIntoRecords(allSchemas, resources, schemaName)[0]
}
