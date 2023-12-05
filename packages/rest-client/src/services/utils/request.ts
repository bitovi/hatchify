import type { PartialSchema, SerializedValue } from "@hatchifyjs/core"
import type {
  CreateType,
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
} from "../types"

/**
 * Coerces the value from the internal client data into something that can be sent with JSON.
 */
export const serializeClientPropertyValuesForRequest = <
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  allSchemas: FinalSchemas,
  schemaName: string,
  attributes: Omit<
    CreateType<GetSchemaFromName<TSchemas, TSchemaName>>,
    "__schema"
  >["attributes"],
): globalThis.Record<string, SerializedValue> => {
  return Object.entries(attributes).reduce((acc, [key, value]) => {
    const attribute = allSchemas[schemaName].attributes[key]

    if (
      attribute != null &&
      attribute.setClientPropertyValue &&
      attribute.serializeClientPropertyValue
    ) {
      const coerced = attribute.setClientPropertyValue(value as any) // todo HATCH-417 remove any
      acc[key] = attribute.serializeClientPropertyValue(coerced as any) // todo HATCH-417 remove any
    } else {
      acc[key] = value as SerializedValue
    }
    return acc
  }, {} as globalThis.Record<string, SerializedValue>)
}

/**
 * Coerces the value from the internal client data into something that can be sent through a filter query.
 */
export const serializeClientQueryFilterValuesForRequest = (
  allSchemas: FinalSchemas,
  schemaName: string,
  filters: globalThis.Record<string, any>,
): globalThis.Record<string, unknown> => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    const attribute = allSchemas[schemaName].attributes[key]
    if (
      attribute != null &&
      attribute.setClientQueryFilterValue &&
      attribute.serializeClientQueryFilterValue
    ) {
      const coerced = attribute.setClientQueryFilterValue(value)
      acc[key] = attribute.serializeClientQueryFilterValue(coerced as any) // todo: HATCH-417 remove any
      acc[key] = value
    }
    return acc
  }, {} as globalThis.Record<string, unknown>)
}
