import type { FinalSchema, PartialSchema } from "@hatchifyjs/hatchify-core"

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

export type PartialSchemas = Record<string, PartialSchema>

export type FinalSchemas = Record<string, FinalSchema>

// * this gets the name from schema object, this does not work when trying to type
// * hatchify return, ie. `app.[schemaName].func()` unless you use `as const`!
// type GetSchemaNames<TSchemas extends globalThis.Record<string, PartialSchema>> =
// TSchemas[keyof TSchemas]["name"]
export type GetSchemaNames<
  TSchemas extends globalThis.Record<string, PartialSchema>,
> = keyof TSchemas

// * see `GetSchemaNames` comment
// type GetSchemaFromName<
//   TSchemas extends globalThis.Record<string, PartialSchema>,
//   TSchemaName extends GetSchemaNames<TSchemas>,
// > = Extract<TSchemas[keyof TSchemas], { name: TSchemaName }>
export type GetSchemaFromName<
  TSchemas extends globalThis.Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = TSchemas[TSchemaName]

export type NumberAsString = "number" | "Number"
export type StringAsString = "string" | "String"

export type IsNumber<TValue> = TValue extends NumberAsString ? true : false
export type IsString<TValue> = TValue extends StringAsString ? true : false

export type RecordType<TPartialSchema extends PartialSchema> = {
  id: string
} & {
  [AttributeName in keyof TPartialSchema["attributes"]]: IsNumber<
    TPartialSchema["attributes"][AttributeName]["control"]["type"]
  > extends true
    ? number
    : IsString<
        TPartialSchema["attributes"][AttributeName]["control"]["type"]
      > extends true
    ? string
    : unknown
}

export type GetAttributes<TSchema extends PartialSchema> = {
  [AttributeName in keyof TSchema["attributes"]]: TSchema["attributes"][AttributeName]
}
