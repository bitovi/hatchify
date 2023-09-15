import {
  createOne,
  createStore,
  deleteOne,
  findAll,
  findOne,
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
  UpdateData,
  RequestMetaData,
  Filters,
} from "@hatchifyjs/rest-client"
import { useCreateOne, useDeleteOne, useAll, useOne, useUpdateOne } from ".."

import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"

export interface SchemaRecord {
  [schemaName: string]: LegacySchema | Schema
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
    useAll: (query?: QueryList, baseFilter?: Filters) => [Record[], Meta]
    useOne: (query: QueryOne | string) => [Record | undefined, Meta]
    useUpdateOne: () => [
      (data: UpdateData) => void,
      Meta,
      Record | undefined | null,
    ]
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
      createOne: (data) =>
        createOne(dataSource, newSchemas, schema.name, {
          ...data,
          __schema: schema.name,
        }),
      deleteOne: (id) => deleteOne(dataSource, newSchemas, schema.name, id),
      findAll: (query) => findAll(dataSource, newSchemas, schema.name, query),
      findOne: (query) => findOne(dataSource, newSchemas, schema.name, query),
      updateOne: (data) =>
        updateOne(dataSource, newSchemas, schema.name, {
          ...data,
          __schema: schema.name,
        }),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, newSchemas, schema.name),
      useDeleteOne: () => useDeleteOne(dataSource, newSchemas, schema.name),
      useAll: (query, baseFilter) =>
        useAll(
          dataSource,
          newSchemas,
          schema.name,
          query ?? {},
          baseFilter ?? {},
        ),
      useOne: (query) => useOne(dataSource, newSchemas, schema.name, query),
      useUpdateOne: () => useUpdateOne(dataSource, newSchemas, schema.name),
    }

    return acc
  }, {} as ReactRest<TSchemaRecord>)

  return functions
}
