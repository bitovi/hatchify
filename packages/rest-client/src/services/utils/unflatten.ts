import type { PartialSchema } from "@hatchifyjs/core"
import type {
  CreateType,
  FinalSchemas,
  FlatCreateType,
  FlatUpdateType,
  GetSchemaFromName,
  GetSchemaNames,
  UpdateType,
} from "../types/index.js"

export function unflattenData<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  allSchemas: FinalSchemas,
  schemaName: string,
  data: Omit<
    FlatCreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
    "__schema"
  >,
): Omit<CreateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">

export function unflattenData<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  allSchemas: FinalSchemas,
  schemaName: string,
  data: Omit<
    FlatUpdateType<GetSchemaFromName<TSchemas, TSchemaName>>,
    "__schema"
  >,
): Omit<UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">

export function unflattenData<
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  allSchemas: FinalSchemas,
  schemaName: string,
  data:
    | Omit<FlatCreateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">
    | Omit<
        FlatUpdateType<GetSchemaFromName<TSchemas, TSchemaName>>,
        "__schema"
      >,
):
  | Omit<CreateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">
  | Omit<UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema"> {
  const schema = allSchemas[schemaName]
  const attributeKeys = Object.keys(schema.attributes)
  const relationshipKeys = Object.keys(schema.relationships || {})

  const attributes = Object.entries(data)
    .filter(([key]) => attributeKeys.includes(key))
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, unknown>,
    )

  const relationships = Object.entries(data)
    .filter(([key]) => relationshipKeys.includes(key))
    .reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, unknown>,
    )

  return {
    attributes,
    relationships,
  } as Omit<CreateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">
}
