import type {
  PartialSchemaWithPrimaryAttribute,
  SemiFinalSchema,
} from "./types"

export function finalizeSchema(
  schema: PartialSchemaWithPrimaryAttribute,
): SemiFinalSchema {
  return {
    ...schema,
    id: schema.id.finalize(),
    attributes: Object.entries(schema.attributes).reduce(
      (acc, [attributeName, attribute]) => ({
        ...acc,
        [attributeName]: attribute.finalize(),
      }),
      {},
    ),
  }
}
