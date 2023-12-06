import type { PartialSchema } from "@hatchifyjs/core"
import isEmpty from "lodash/isEmpty"
import type {
  RestClient,
  GetSchemaNames,
  FinalSchemas,
  UpdateType,
  GetSchemaFromName,
  RecordType,
  FlatUpdateType,
} from "../../types"
import { notifySubscribers } from "../../store"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
  serializeClientPropertyValuesForRequest,
  flattenResourcesIntoRecords,
  unflattenData,
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
  data: Omit<
    FlatUpdateType<GetSchemaFromName<TSchemas, TSchemaName>>,
    "__schema"
  >,
): Promise<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>> => {
  if (!schemaNameIsString(schemaName)) {
    throw new SchemaNameNotStringError(schemaName)
  }

  const { attributes, relationships } = unflattenData(
    allSchemas,
    schemaName,
    data,
  )

  const serializedAttributes = isEmpty(attributes)
    ? undefined
    : (serializeClientPropertyValuesForRequest(
        allSchemas,
        schemaName,
        attributes,
      ) as UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>["attributes"])

  // todo: HATCH-417; return from `findAll` needs to be a typed `Resource` using generics
  const resources = await dataSource.updateOne(allSchemas, schemaName, {
    __schema: schemaName,
    id: data.id,
    attributes: serializedAttributes,
    relationships: relationships || undefined, // does not need to be serialized! only ids, does not contain attribute values
  })

  notifySubscribers()

  // todo: HATCH-417; return from `flattenResourcesIntoRecords` needs to be `RecordType`
  // @ts-expect-error
  return flattenResourcesIntoRecords(
    allSchemas,
    resources.record,
    resources.related,
    // schemaName,
  )
}
