import type { FinalSchemas } from "../types"

/**
 * Coerces the value from the server into the value expected by the client.
 */
export const setClientPropertyValuesFromResponse = (
  allSchemas: FinalSchemas,
  schemaName: string,
  attributes: globalThis.Record<string, any>,
): globalThis.Record<string, unknown> => {
  return Object.entries(attributes).reduce(
    (acc, [key, value]) => {
      const attribute = allSchemas[schemaName].attributes[key]
      if (attribute != null && attribute.setClientPropertyValueFromResponse) {
        try {
          acc[key] = attribute?.setClientPropertyValueFromResponse(value)
          return acc
        } catch (e: any) {
          console.error(
            `Setting value \`${value}\` on attribute \`${key}\`:`,
            e?.message,
          )
        }
      }

      acc[key] = value
      return acc
    },
    {} as globalThis.Record<string, unknown>,
  )
}
