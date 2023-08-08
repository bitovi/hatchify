import { number } from "./dataTypes"
import type { PartialSchemaV2, SchemaV2 } from "./types"

interface PartialSchemas {
  [schemaName: string]: PartialSchemaV2
}

interface Schemas {
  [schemaName: string]: SchemaV2
}

export function assembler(schemas: PartialSchemas): Schemas {
  return Object.entries(schemas).reduce(
    (acc, [schemaName, schema]) => ({
      ...acc,
      [schemaName]: {
        ...schema,
        id: schema.id?.finalize(true) || getDefaultPrimaryAttribute(),
        attributes: Object.entries(schema.attributes).reduce(
          (acc, [attributeName, attribute]) => ({
            ...acc,
            [attributeName]: attribute.finalize(),
          }),
          {},
        ),
      },
    }),
    {},
  )
}

function getDefaultPrimaryAttribute() {
  return number({
    primary: true,
    autoIncrement: true,
    required: true,
    min: 1,
  }).finalize()
}
