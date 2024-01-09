import type { PartialSchema } from "../types/index.js"

type UISchemaAttributes<TPartialSchema extends PartialSchema> = {
  [attributeName in keyof TPartialSchema["attributes"]]?: {
    control: {
      ui: TPartialSchema["attributes"][attributeName]["control"]["ui"]
    }
  }
}

interface PartialUISchema<TPartialSchema extends PartialSchema> {
  ui?: PartialSchema["ui"]
  attributes?: UISchemaAttributes<TPartialSchema>
}

export type PartialUISchemas<
  TPartialSchemas extends Record<string, PartialSchema>,
> = {
  [schemaName in keyof TPartialSchemas]?: PartialUISchema<
    TPartialSchemas[schemaName]
  >
}

/**
 * Merges a set of partial schemas with a set of partial UI schemas. If the partial UI schema
 * or any of it's attibutes do not exist in the set of partial schemas, they are ignored.
 */
export function mergeSchemaUI<
  TPartialSchemas extends Record<string, PartialSchema>,
>(
  schemas: TPartialSchemas,
  uiSchemas: PartialUISchemas<TPartialSchemas>,
): Record<string, PartialSchema> {
  const mergedSchemas = {} as Record<string, PartialSchema>
  const schemaNames = Object.keys(schemas)

  for (const schemaName of schemaNames) {
    mergedSchemas[schemaName] = schemas[schemaName]
    const uiSchema = uiSchemas[schemaName]

    if (!uiSchema) {
      continue
    }

    if (uiSchema.ui) {
      mergedSchemas[schemaName].ui = {
        ...mergedSchemas[schemaName].ui,
        ...uiSchema.ui,
      }
    }

    if (uiSchema.attributes) {
      const attributeNames = Object.keys(mergedSchemas[schemaName].attributes)

      for (const attributeName of attributeNames) {
        const attributeUi = uiSchema.attributes[attributeName]?.control?.ui

        if (!attributeUi) {
          continue
        }

        mergedSchemas[schemaName].attributes[attributeName].control = {
          ...mergedSchemas[schemaName].attributes[attributeName].control,
          ui: {
            ...mergedSchemas[schemaName].attributes[attributeName].control.ui,
            ...attributeUi,
          },
        }
      }
    }
  }

  return mergedSchemas
}
