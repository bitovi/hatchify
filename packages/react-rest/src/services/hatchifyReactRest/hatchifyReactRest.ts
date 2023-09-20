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
  Filters,
  Meta,
  QueryList,
  QueryOne,
  Record,
  RequestMetaData,
  Schema,
  Schemas,
  Source,
  UpdateData,
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
  const storeKeys = Object.values(schemas).map((schema) =>
    schema?.namespace ? `${schema.namespace}.${schema.name}` : schema.name,
  )
  createStore(storeKeys)

  const newSchemas = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.namespace ? `${schema.namespace}.${schema.name}` : schema.name] =
      "displayAttribute" in schema ? schema : transformSchema(schema)
    return acc
  }, {} as Schemas)

  const functions = Object.values(schemas).reduce((acc, schema) => {
    const schemaName = schema.namespace
      ? `${schema.namespace}.${schema.name}`
      : schema.name

    const methods = {
      // promises
      createOne: (data) =>
        createOne(dataSource, newSchemas, schemaName, {
          ...data,
          __schema: schemaName,
        }),
      deleteOne: (id) => deleteOne(dataSource, newSchemas, schemaName, id),
      findAll: (query) => findAll(dataSource, newSchemas, schemaName, query),
      findOne: (query) => findOne(dataSource, newSchemas, schemaName, query),
      updateOne: (data) =>
        updateOne(dataSource, newSchemas, schemaName, {
          ...data,
          __schema: schemaName,
        }),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, newSchemas, schemaName),
      useDeleteOne: () => useDeleteOne(dataSource, newSchemas, schemaName),
      useAll: (query, baseFilter) =>
        useAll(dataSource, newSchemas, schemaName, query ?? {}, baseFilter),
      useOne: (query) => useOne(dataSource, newSchemas, schemaName, query),
      useUpdateOne: () => useUpdateOne(dataSource, newSchemas, schemaName),
    }

    if (schema.namespace) {
      acc[schema.namespace] = { [schema.name]: methods }
    } else {
      acc[schema.name as SchemaKeys<TSchemaRecord>] = methods
    }

    return acc
  }, {} as ReactRest<TSchemaRecord>)

  return functions
}
