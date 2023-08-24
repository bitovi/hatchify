import {
  createOne,
  createStore,
  deleteOne,
  findAll,
  findOne,
  subscribeToAll,
  subscribeToOne,
  transformSchema,
  updateOne,
} from "@hatchifyjs/rest-client"
import type {
  CreateData,
  Meta,
  Schema,
  Schemas,
  Source,
  QueryList,
  QueryOne,
  Record,
  Unsubscribe,
  UpdateData,
  RequestMetaData,
} from "@hatchifyjs/rest-client"
import { useCreateOne, useDeleteOne, useAll, useOne, useUpdateOne } from ".."

// import type {
//   FinalSchema,
//   Schema as LegacySchema,
//   PartialSchema,
// } from "@hatchifyjs/hatchify-core"
// import { assembler, integer } from "@hatchifyjs/hatchify-core"
import { RestClient } from "@hatchifyjs/rest-client"

export interface SchemaRecord {
  [schemaName: string]: Schema
}
type SchemaKeys<Schema extends SchemaRecord> = keyof Schema

export type ReactRest<Schema extends SchemaRecord> = {
  [schemaName in SchemaKeys<Schema>]: {
    // promises
    createOne: (data: CreateData) => Promise<Record>
    deleteOne: (id: string) => Promise<void>
    findOne: (query: QueryOne | string) => Promise<Record | undefined>
    findAll: (
      query: QueryList,
    ) => Promise<[Records: Record[], Meta: RequestMetaData]>
    updateOne: (data: UpdateData) => Promise<Record | null>
    // hooks
    useCreateOne: () => [(data: CreateData) => void, Meta, Record?]
    useDeleteOne: () => [(id: string) => void, Meta]
    useAll: (query?: QueryList) => [Record[], Meta]
    useOne: (query: QueryOne | string) => [Record | undefined, Meta]
    useUpdateOne: () => [
      (data: UpdateData) => void,
      Meta,
      Record | undefined | null,
    ]
    // subscribes
    subscribeToAll: (
      query: QueryList | undefined,
      callback: (data: Record[]) => void,
    ) => Unsubscribe
    subscribeToOne: (
      id: string,
      callback: (data: Record) => void,
    ) => Unsubscribe
  }
}

/**
 * Returns a set of functions for interacting with the rest-client store and
 * data source for each schema.
 */
export function hatchifyReactRest<TSchemaRecord extends SchemaRecord>(
  schemas: TSchemaRecord,
  dataSource: Source,
): ReactRest<TSchemaRecord> {
  const storeKeys = Object.values(schemas).map((schema) => schema.name)
  createStore(storeKeys)

  const newSchemas = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name] =
      "displayAttribute" in schema ? schema : transformSchema(schema)
    return acc
  }, {} as Schemas)

  const functions = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name as SchemaKeys<TSchemaRecord>] = {
      // promises
      createOne: (data) => createOne(dataSource, newSchemas, schema.name, data),
      deleteOne: (id) => deleteOne(dataSource, newSchemas, schema.name, id),
      findAll: (query) => findAll(dataSource, newSchemas, schema.name, query),
      findOne: (query) => findOne(dataSource, newSchemas, schema.name, query),
      updateOne: (data) => updateOne(dataSource, newSchemas, schema.name, data),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, newSchemas, schema.name),
      useDeleteOne: () => useDeleteOne(dataSource, newSchemas, schema.name),
      useAll: (query) =>
        useAll(dataSource, newSchemas, schema.name, query ?? {}),
      useOne: (query) => useOne(dataSource, newSchemas, schema.name, query),
      useUpdateOne: () => useUpdateOne(dataSource, newSchemas, schema.name),
      // subscribes
      subscribeToAll: (query, callback) =>
        subscribeToAll(schema.name, query, callback),
      subscribeToOne: (id, callback) =>
        subscribeToOne(schema.name, id, callback),
    }

    return acc
  }, {} as ReactRest<TSchemaRecord>)

  return functions
}

// ----------------------------------------------------------------------------

// // maps control.type to a typescript type, eg. "Integer" => number, fallback to string
// type AttributeValue<T> = T extends "Number" | "number" | "Integer" | "integer"
//   ? number
//   : string

// // attribute type (based on FinalAttribute)
// type AttributeType = FinalSchema["attributes"][number]

// // [attributeName: string]: AttributeType (control from FinalAttribute)
// type Attributes = globalThis.Record<string, AttributeType>

// // [attributeName: string]: AttributeValue (typescript type)
// type AttributeValues<T extends Attributes> = {
//   [key in keyof T]: AttributeValue<T[key]>
// }

// // for given attributes, convert AttributeType (schema v2) to AttributeValue (typescript type)
// function parse<T extends Attributes>(attributes: T): AttributeValues<T> {
//   return Object.entries(attributes).reduce((acc, [key, value]) => {
//     acc[key] = attributes[key].control.type as AttributeValue<T[keyof T]>
//     return acc
//   }, {} as AttributeValues<T>)
// }

// const Todo: PartialSchema = {
//   name: "Todo",
//   id: integer({ required: true, autoIncrement: true }),
//   attributes: {
//     importance: integer({ min: 0 }),
//   },
// }

// const assembled = assembler({ Todo })
// assembled.Todo.attributes.importance.control.type

// const TypedTodo = parse(assembled.Todo.attributes)
// TypedTodo.importance

// export interface v2SchemaRecord {
//   [schemaName: string]: PartialSchema
// }
// type v2SchemaKeys<PartialSchema extends v2SchemaRecord> = keyof PartialSchema
// export type v2ReactRest<PartialSchema extends v2SchemaRecord> = {
//   [schemaName in v2SchemaKeys<PartialSchema>]: {
//     // promises
//     findAll: (
//       query: QueryList,
//     ) => Promise<[Records: Record[], Meta: RequestMetaData]>
//     // hooks
//     useAll: (query?: QueryList) => [Record[], Meta]
//     // subscribes
//     subscribeToAll: (
//       query: QueryList | undefined,
//       callback: (data: Record[]) => void,
//     ) => Unsubscribe
//   }
// }

// export function hatchifyV2<TSchemaRecord extends v2SchemaRecord>(
//   schemas: TSchemaRecord,
//   restClient: RestClient,
// ): v2ReactRest<TSchemaRecord> {
//   const finalSchemas = assembler(schemas)
//   console.log("assembled", finalSchemas)

//   const functions = Object.values(finalSchemas).reduce((acc, schema) => {
//     acc[schema.name as v2SchemaKeys<TSchemaRecord>] = {
//       findAll: (query) => findAll(restClient, finalSchemas, schema.name, query),
//       useAll: (query) =>
//         useAll(restClient, finalSchemas, schema.name, query ?? {}),
//       subscribeToAll: (query, callback) =>
//         subscribeToAll(schema.name, query, callback),
//     }

//     return acc
//   }, {} as v2ReactRest<TSchemaRecord>)

//   return functions
// }
