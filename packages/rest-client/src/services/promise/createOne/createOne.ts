import type { PartialSchema } from "@hatchifyjs/core"
import type {
  RestClient,
  GetSchemaNames,
  FinalSchemas,
  CreateType,
  GetSchemaFromName,
  RecordType,
  FlatCreateType,
} from "../../types"
import { notifySubscribers } from "../../store"
import {
  SchemaNameNotStringError,
  schemaNameIsString,
  serializeClientPropertyValuesForRequest,
} from "../../utils"
import { flattenResourcesIntoRecords, unflattenData } from "../../utils/records"

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
  data: Omit<
    FlatCreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
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

  const serializedAttributes = serializeClientPropertyValuesForRequest(
    allSchemas,
    schemaName,
    attributes,
  ) as CreateType<GetSchemaFromName<TSchemas, TSchemaName>>["attributes"]

  // todo: HATCH-417; return from `findAll` needs to be a typed `Resource` using generics
  const resources = await dataSource.createOne(allSchemas, schemaName, {
    __schema: schemaName,
    attributes: serializedAttributes,
    relationships: relationships, // does not need to be serialized! only ids, does not contain attribute values
  })

  notifySubscribers()

  // todo: HATCH-417; return from `flattenResourcesIntoRecords` needs to be `RecordType`
  // @ts-expect-error
  return flattenResourcesIntoRecords(
    allSchemas,
    resources.record,
    resources.related,
  )
}
