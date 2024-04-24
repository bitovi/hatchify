import type { PartialAttributeRecord, PartialSchema } from "./types.js"

export function ensureDefaultReadOnlyAttribute(
  schema: PartialSchema,
): PartialSchema {
  return {
    ...schema,
    attributes: Object.entries(schema.attributes).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: {
          ...value,
          control: {
            ...value.control,
            readOnly: value.control.readOnly || schema.readOnly,
          },
        },
      }),
      {} as PartialAttributeRecord,
    ),
  }
}
