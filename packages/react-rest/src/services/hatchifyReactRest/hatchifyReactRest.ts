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
  Source,
  QueryList,
  QueryOne,
  Record,
  Unsubscribe,
  UpdateData,
} from "@hatchifyjs/rest-client"
import { useCreateOne, useDeleteOne, useAll, useOne, useUpdateOne } from ".."

import type { Schemas, Schema } from "@hatchifyjs/rest-client"
import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"

interface SchemaRecord {
  [schemaName: string]: LegacySchema | Schema
}
type SchemaKeys<Schema extends SchemaRecord> = keyof Schema

type ReactRest<Schema extends SchemaRecord> = {
  [schemaName in SchemaKeys<Schema>]: {
    // promises
    createOne: (data: CreateData) => Promise<Record>
    deleteOne: (id: string) => Promise<void>
    findOne: (query: QueryOne) => Promise<Record | undefined>
    findAll: (query: QueryList) => Promise<Record[]>
    updateOne: (data: UpdateData) => Promise<Record>
    // hooks
    useCreateOne: () => [(data: CreateData) => void, Meta, Record?]
    useDeleteOne: () => [(id: string) => void, Meta]
    useAll: (query: QueryList) => [Record[], Meta]
    useOne: (query: QueryOne) => [Record | undefined, Meta]
    useUpdateOne: (id: string) => [(data: CreateData) => void, Meta, Record?]
    // subscribes
    subscribeToAll: (callback: (data: Record[]) => void) => Unsubscribe
    subscribeToOne: (
      callback: (data: Record) => void,
      id: string,
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
      useAll: (query) => useAll(dataSource, newSchemas, schema.name, query),
      useOne: (query) => useOne(dataSource, newSchemas, schema.name, query),
      useUpdateOne: () => useUpdateOne(dataSource, newSchemas, schema.name),
      // subscribes
      subscribeToAll: (callback) => subscribeToAll(schema.name, callback),
      subscribeToOne: (callback, id) =>
        subscribeToOne(schema.name, callback, id),
    }

    return acc
  }, {} as ReactRest<TSchemaRecord>)

  return functions
}
