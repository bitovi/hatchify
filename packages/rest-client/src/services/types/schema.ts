import type { FinalSchema, PartialSchema } from "@hatchifyjs/core"

export type EnumObject = { type: "enum"; allowNull?: boolean; values: string[] }
export type AttributeObject = { type: string; allowNull?: boolean } | EnumObject
export type Attribute = string | AttributeObject

export interface Schema {
  name: string // "Article"
  namespace?: string
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

export type NumberAsString = "number" | "Number" | "NUMBER"
export type StringAsString = "string" | "String" | "STRING"
export type DateAsString = "datetime" | "Datetime" | "DATETIME"

export type IsNullable<TValue> = TValue extends true ? true : false
export type IsNumber<TValue> = TValue extends NumberAsString ? true : false
export type IsString<TValue> = TValue extends StringAsString ? true : false
export type IsDate<TValue> = TValue extends DateAsString ? true : false
export type IsMutateDate<TValue, TMutate> = TValue extends DateAsString
  ? TMutate extends true
    ? true
    : false
  : false

export type RecordType<TPartialSchema extends PartialSchema> = {
  id: string
} & {
  [AttributeName in keyof TPartialSchema["attributes"]]: GetTypedAttribute<
    TPartialSchema["attributes"],
    AttributeName,
    false
  >
}

export type CreateType<TPartialSchema extends PartialSchema> = {
  __schema: TPartialSchema["name"]
} & {
  [AttributeName in keyof TPartialSchema["attributes"]]: GetTypedAttribute<
    TPartialSchema["attributes"],
    AttributeName,
    true
  >
}

// export type MandateProps<T extends {}, K extends keyof T> = Omit<T, K> & {
//   [MK in K]-?: NonNullable<T[MK]>
// }

export type UpdateType<TPartialSchema extends PartialSchema> = {
  id: string
} & Partial<CreateType<TPartialSchema>>

export type GetAttributes<TSchema extends PartialSchema> = {
  [AttributeName in keyof TSchema["attributes"]]: TSchema["attributes"][AttributeName]
}

export type GetTypedAttribute<
  TAttributes extends PartialSchema["attributes"],
  TAttributeName extends keyof TAttributes,
  Mutate extends boolean,
> = IsNumber<TAttributes[TAttributeName]["control"]["type"]> extends true
  ? IsNullable<TAttributes[TAttributeName]["control"]["allowNull"]> extends true
    ? number | null | undefined
    : number
  : IsString<TAttributes[TAttributeName]["control"]["type"]> extends true
  ? IsNullable<TAttributes[TAttributeName]["control"]["allowNull"]> extends true
    ? string | null | undefined
    : string
  : IsDate<TAttributes[TAttributeName]["control"]["type"]> extends true
  ? Mutate extends true
    ? IsNullable<
        TAttributes[TAttributeName]["control"]["allowNull"]
      > extends true
      ? Date | string | null | undefined
      : Date | string
    : IsNullable<
        TAttributes[TAttributeName]["control"]["allowNull"]
      > extends true
    ? Date | null | undefined
    : Date
  : unknown

const att = {
  title: {
    name: "integer()",
    control: {
      type: "Number" as const,
      allowNull: true as const,
      // allowNull: false as const,
      // allowNull: true,
    },
    orm: {
      sequelize: {
        type: "DECIMAL",
        typeArgs: [],
        allowNull: false,
        autoIncrement: false,
        primaryKey: false,
        defaultValue: undefined,
      },
    },
    finalize: (() => {}) as any,
  },
}

let aaaa: GetTypedAttribute<typeof att, "title", false> = 555
