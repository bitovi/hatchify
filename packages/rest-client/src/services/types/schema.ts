import type {
  FinalSchema,
  PartialSchema,
  //ControlTypes
} from "@hatchifyjs/core"

export type FinalSchemas = Record<string, FinalSchema>

export type GetSchemaNames<
  TSchemas extends globalThis.Record<string, PartialSchema>,
> = keyof TSchemas

export type GetSchemaFromName<
  TSchemas extends globalThis.Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = TSchemas[TSchemaName]

export type FlatCreateType<TPartialSchema extends PartialSchema> = {
  __schema: TPartialSchema["name"]
} & TypedAttributes<TPartialSchema["attributes"], true> &
  MutateRelationships<TPartialSchema>

export type CreateType<TPartialSchema extends PartialSchema> = {
  __schema: TPartialSchema["name"]
} & { attributes: TypedAttributes<TPartialSchema["attributes"], true> } & {
  relationships?: MutateRelationships<TPartialSchema>
}

export type FlatUpdateType<TPartialSchema extends PartialSchema> = {
  id: string
} & Partial<FlatCreateType<TPartialSchema>>

export type UpdateType<TPartialSchema extends PartialSchema> = {
  id: string
} & Partial<CreateType<TPartialSchema>>

export type RecordType<
  TSchemas extends Record<string, PartialSchema>,
  TPartialSchema extends PartialSchema,
  TMutate extends boolean = false,
  TLooseTyping extends boolean = false,
> = {
  id: string
} & TypedAttributes<TPartialSchema["attributes"], TMutate> &
  TypedRelationships<TSchemas, TPartialSchema, TMutate> &
  // A client is using computed fields which are not in the schema and then
  // using compound column components. With `TLooseTyping` we can keep type
  // safety for the schema attributes and relationships while allowing the
  // client to use custom computed fields & not receive type errors.
  // @TODO HATCH-417 - should we force the client to type beyond the schema?
  (TLooseTyping extends true ? { [field: string]: any } : Record<string, never>)

// Convert object of attributes into a union of attribute objects
type CreateAttributeUnion<
  A extends Record<string, { control: { type: string; allowNull?: boolean } }>,
> = {
  [Name in keyof A]: { key: Name } & A[Name]
}[keyof A]

// Convert union of attribute objects into an object of attributes with correct types
type UnionToObject<
  Union extends { key: string | number | symbol },
  TMutate extends boolean,
> = {
  [Key in Union["key"]]: Extract<Union, { key: Key }> extends {
    control: { type: infer Type; values?: infer EnumValues }
  }
    ? Type extends "Number"
      ? number
      : Type extends "Boolean"
        ? boolean
        : Type extends "enum"
          ? EnumValues[any]
          : Type extends "String"
            ? string
            : Type extends "Dateonly"
              ? string
              : Type extends "Date"
                ? TMutate extends true
                  ? Date | string
                  : Date
                : "a"
    : "b"
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
  TMutate extends boolean,
> = Partial<UnionToObject<ExtractFromAttributeUnion<T, P>, TMutate>>

// Extract subset of attributes from a union which are not allowed to be null
type NoNulls<
  T extends Record<
    string,
    { control: { type: string; allowNullInfer?: boolean } }
  >,
  P extends { control: { allowNullInfer: boolean } },
  TMutate extends boolean,
> = UnionToObject<ExtractFromAttributeUnion<T, P>, TMutate>

// Merge the two subsets of attributes (allowNull and required) into a single object
type TypedAttributes<
  T extends Record<
    string,
    { control: { type: string; allowNullInfer?: boolean } }
  >,
  TMutate extends boolean,
> = AllowNulls<T, { control: { allowNullInfer: true } }, TMutate> &
  NoNulls<T, { control: { allowNullInfer: false } }, TMutate>

// For each relationship on a schema, determine the type of the relationship: one or many
type TypedRelationships<
  TSchemas extends Record<string, PartialSchema>,
  TPartialSchema extends PartialSchema,
  TMutate extends boolean,
> = {
  // @ts-expect-error HATCH-417
  [Relationship in keyof TPartialSchema["relationships"]]: TPartialSchema["relationships"][Relationship]["type"] extends
    | "hasOne"
    | "belongsTo"
    ? TypedRelationship<
        TSchemas,
        // @ts-expect-error HATCH-417
        TPartialSchema["relationships"][Relationship]["targetSchema"],
        TMutate
      >
    : Array<
        TypedRelationship<
          TSchemas,
          // @ts-expect-error HATCH-417
          TPartialSchema["relationships"][Relationship]["targetSchema"],
          TMutate
        >
      >
}

// Get the attributes for the related (targetSchema) schema
type TypedRelationship<
  TSchemas extends Record<string, PartialSchema>,
  TTargetSchema extends string,
  TMutate extends boolean,
> = { id: string } & TypedAttributes<
  GetSchemaFromName<TSchemas, TTargetSchema>["attributes"],
  TMutate
> & { [field: string]: any }

// For each relationship on a schema, determine the type of the relationship: one or many
export type MutateRelationships<TPartialSchema extends PartialSchema> = {
  // @ts-expect-error HATCH-417
  [Relationship in keyof TPartialSchema["relationships"]]?: TPartialSchema["relationships"][Relationship]["type"] extends
    | "hasOne"
    | "belongsTo"
    ? MutateRelationship
    : MutateRelationship[]
}

// For mutating, a relationship only needs an id
export type MutateRelationship = {
  id: string
}
