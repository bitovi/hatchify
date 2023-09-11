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
export type DateAsString = "datetime" | "Datetime"

export type IsNumber<TValue> = TValue extends NumberAsString ? true : false
export type IsString<TValue> = TValue extends StringAsString ? true : false
export type IsDate<TValue> = TValue extends DateAsString ? true : false

export type RecordType<TPartialSchema extends PartialSchema> = {
  id: string
} & {
  [AttributeName in keyof TPartialSchema["attributes"]]: GetTypedAttribute<
    TPartialSchema["attributes"],
    AttributeName
  >
}

export type CreateType<TPartialSchema extends PartialSchema> = {
  __schema: TPartialSchema["name"]
  attributes: {
    [AttributeName in keyof TPartialSchema["attributes"]]: GetTypedAttribute<
      TPartialSchema["attributes"],
      AttributeName
    >
  }
}

export type UpdateType<TPartialSchema extends PartialSchema> = {
  id: string
} & {
  attributes: Partial<CreateType<TPartialSchema>["attributes"]>
}

export type GetAttributes<TSchema extends PartialSchema> = {
  [AttributeName in keyof TSchema["attributes"]]: TSchema["attributes"][AttributeName]
}

export type GetTypedAttribute<
  TAttributes extends PartialSchema["attributes"],
  TAttributeName extends keyof TAttributes,
> = IsNumber<TAttributes[TAttributeName]["control"]["type"]> extends true
  ? number
  : IsString<TAttributes[TAttributeName]["control"]["type"]> extends true
  ? string
  : IsDate<TAttributes[TAttributeName]["control"]["type"]> extends true
  ? Date | string // Date object or ISO string
  : unknown
