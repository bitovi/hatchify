import {
  createOne,
  createStore,
  deleteOne,
  findAll,
  findOne,
  schemaNameWithNamespace,
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

import type { Schema as LegacySchema } from "@hatchifyjs/core"

export interface SchemaRecord {
  [schemaName: string]: LegacySchema | Schema
}
export type SchemaKeys<Schema extends SchemaRecord> = keyof Schema

export type ReactRest = {
  [schemaName: string]: {
    // promises
    createOne: (data: CreateData) => Promise<Record>
    deleteOne: (id: string) => Promise<void>
    findOne: (query: QueryOne | string) => Promise<Record | undefined>
    findAll: (
      query: QueryList,
    ) => Promise<[Records: Record[], Meta: RequestMetaData]>
    updateOne: (data: UpdateData) => Promise<Record>
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
export function hatchifyReactRest(dataSource: Source): ReactRest {
  const { completeSchemaMap: schemas } = dataSource

  const storeKeys = Object.values(schemas).map((schema) =>
    schemaNameWithNamespace(schema),
  )
  createStore(storeKeys)

  const formattedSchemas = Object.values(schemas).reduce((acc, schema) => {
    acc[schemaNameWithNamespace(schema)] =
      "displayAttribute" in schema ? schema : transformSchema(schema)
    return acc
  }, {} as Schemas)

  const functions = Object.values(schemas).reduce((acc, schema) => {
    const schemaName = schemaNameWithNamespace(schema)

    acc[schemaName] = {
      // promises
      createOne: (data) =>
        createOne(dataSource, formattedSchemas, schemaName, {
          ...data,
          __schema: schemaName,
        }),
      deleteOne: (id) =>
        deleteOne(dataSource, formattedSchemas, schemaName, id),
      findAll: (query) =>
        findAll(dataSource, formattedSchemas, schemaName, query),
      findOne: (query) =>
        findOne(dataSource, formattedSchemas, schemaName, query),
      updateOne: (data) =>
        updateOne(dataSource, formattedSchemas, schemaName, {
          ...data,
          __schema: schemaName,
        }),
      // hooks
      useCreateOne: () =>
        useCreateOne(dataSource, formattedSchemas, schemaName),
      useDeleteOne: () =>
        useDeleteOne(dataSource, formattedSchemas, schemaName),
      useAll: (query, baseFilter) =>
        useAll(
          dataSource,
          formattedSchemas,
          schemaName,
          query ?? {},
          baseFilter,
        ),
      useOne: (query) =>
        useOne(dataSource, formattedSchemas, schemaName, query),
      useUpdateOne: () =>
        useUpdateOne(dataSource, formattedSchemas, schemaName),
    }

    return acc
  }, {} as ReactRest)

  return functions
}
