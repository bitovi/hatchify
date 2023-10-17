import {
  FinalSchema,
  PartialRelationship,
  PartialSchema,
  belongsTo,
  boolean,
  integer,
  string,
} from "@hatchifyjs/core"

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

export type FinalSchemas = Record<string, FinalSchema>

export type GetSchemaNames<
  TSchemas extends globalThis.Record<string, PartialSchema>,
> = keyof TSchemas

export type GetSchemaFromName<
  TSchemas extends globalThis.Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = TSchemas[TSchemaName]

export type CreateType<
  TSchemas extends Record<string, PartialSchema>,
  TPartialSchema extends PartialSchema,
> = {
  __schema: TPartialSchema["name"]
} & {
  attributes: Omit<RecordType<TSchemas, TPartialSchema, true>, "id">
}

export type UpdateType<
  TSchemas extends Record<string, PartialSchema>,
  TPartialSchema extends PartialSchema,
> = {
  id: string
} & Partial<CreateType<TSchemas, TPartialSchema>>

export type RecordType<
  TSchemas extends Record<string, PartialSchema>,
  TPartialSchema extends PartialSchema,
  Mutate extends boolean = false,
> = {
  id: string
} & TypedAttributes<TPartialSchema["attributes"], Mutate> & {
    [Relationship in keyof TPartialSchema["relationships"]]: {
      id: string
    } & TypedRelationship<
      TSchemas,
      TPartialSchema["relationships"][Relationship]["targetSchema"],
      Mutate
    > & {
        [field: string]: any
      }
  }

// Convert object of attributes into a union of attribute objects
type CreateAttributeUnion<
  A extends Record<string, { control: { type: string; allowNull?: boolean } }>,
> = {
  [Name in keyof A]: { key: Name } & A[Name]
}[keyof A]

// Convert union of attribute objects into an object of attributes with correct types
type UnionToObject<
  Union extends { key: string | number | symbol },
  Mutate extends boolean,
> = {
  [Key in Union["key"]]: Extract<Union, { key: Key }> extends {
    control: { type: infer Type }
  }
    ? Type extends "Number" | "number" | "NUMBER"
      ? number
      : Type extends "Boolean" | "boolean" | "BOOLEAN"
      ? boolean
      : Type extends "String" | "string" | "STRING"
      ? string
      : Type extends "Datetime" | "datetime" | "DATETIME"
      ? Mutate extends true
        ? Date | string
        : Date
      : never
    : never
}

// Extract subset of attributes from a union
type ExtractFromAttributeUnion<
  T extends Record<
    string,
    { control: { type: string; allowNullInfer?: boolean } }
  >,
  P extends { control: { allowNullInfer: boolean } },
> = Extract<CreateAttributeUnion<T>, P>

// Extract subset of attributes from a union which are allowed to be null
type AllowNulls<
  T extends Record<
    string,
    { control: { type: string; allowNullInfer?: boolean } }
  >,
  P extends { control: { allowNullInfer: boolean } },
  Mutate extends boolean,
> = Partial<UnionToObject<ExtractFromAttributeUnion<T, P>, Mutate>>

// Extract subset of attributes from a union which are not allowed to be null
type NoNulls<
  T extends Record<
    string,
    { control: { type: string; allowNullInfer?: boolean } }
  >,
  P extends { control: { allowNullInfer: boolean } },
  Mutate extends boolean,
> = UnionToObject<ExtractFromAttributeUnion<T, P>, Mutate>

// Merge the two subsets of attributes (allowNull and required) into a single object
type TypedAttributes<
  T extends Record<
    string,
    { control: { type: string; allowNullInfer?: boolean } }
  >,
  Mutate extends boolean,
> = AllowNulls<T, { control: { allowNullInfer: true } }, Mutate> &
  NoNulls<T, { control: { allowNullInfer: false } }, Mutate>

type TypedRelationship<
  TSchemas extends Record<string, PartialSchema>,
  TTargetSchema extends string,
  Mutate extends boolean,
> = TypedAttributes<
  GetSchemaFromName<TSchemas, TTargetSchema>["attributes"],
  Mutate
>

// const partialTodo = {
//   name: "Todo",
//   attributes: {
//     title: string(),
//   },
//   relationships: {
//     user: belongsTo("User"),
//   },
// } satisfies PartialSchema

// partialTodo.relationships.user.targetSchema
// //                              ^?

// const partialUser = {
//   name: "User",
//   attributes: {
//     name: string({ required: true }),
//     optName: string(),
//     age: integer({ required: true }),
//     optAge: integer(),
//     employed: boolean({ required: true }),
//     optEmployed: boolean({ required: false }),
//   },
// }

// type Prettify<T> = {
//   [K in keyof T]: T[K]
// } & {}

// type Schemass = { Todo: typeof partialTodo; User: typeof partialUser }

// type AA = GetSchemaFromName<
//   { Todo: typeof partialTodo; User: typeof partialUser },
//   typeof partialTodo.relationships.user.targetSchema
// >

// type BB = Prettify<AA>["attributes"]["name"]
// //   ^?

// type CC = {
//   [Relationship in keyof typeof partialTodo.relationships]: (typeof partialTodo.relationships)[Relationship]["targetSchema"]
// }

// type DD = Prettify<CC>
// //   ^?

// type EE = TypedRelationships<
//   Schemass,
//   (typeof partialTodo.relationships)["user"],
//   false
// >["attributes"]["name"]
// //   ^?

// type FF = Prettify<
//   RecordType<Schemass, typeof partialTodo, false>
// >["user"][""]
//   ^?
