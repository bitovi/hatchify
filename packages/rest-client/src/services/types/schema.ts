import { FinalSchema } from "@hatchifyjs/hatchify-core"

export type EnumObject = { type: "enum"; allowNull?: boolean; values: string[] }
export type AttributeObject = { type: string; allowNull?: boolean } | EnumObject
export type Attribute = string | AttributeObject

export interface Schema {
  name: string // "Article"
  displayAttribute: string
  attributes: {
    [field: string]: Attribute
  }
  relationships?: {
    [field: string]: {
      type: "many" | "one"
      schema: string
    }
  }
}

export type Schemas = Record<string, Schema>

export type FinalSchemas = Record<string, FinalSchema>

export function isSchemaV2(
  schema: Schema | FinalSchema,
): schema is FinalSchema {
  return "id" in schema && "orm" in schema.id
}

export function isSchemasV2(
  schemas: Schemas | FinalSchemas,
): schemas is FinalSchemas {
  return Object.values(schemas).every(isSchemaV2)
}
