import type { FinalSchema, PartialSchemaWithPrimaryAttribute } from "./types"

export function finalizeSchema(
  schema: PartialSchemaWithPrimaryAttribute,
): FinalSchema {
  return {
    ...schema,
    id: schema.id.finalize(),
    attributes: Object.entries(schema.attributes).reduce(
      (acc, [attributeName, attribute]) => ({
        ...acc,
        // @ts-expect-error - todo: arthur
        [attributeName]: attribute.finalize(),
      }),
      {},
    ),
  }
}
