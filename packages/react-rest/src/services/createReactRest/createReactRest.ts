import {
  createOne,
  createStore,
  deleteOne,
  getList,
  getOne,
  subscribeToList,
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
  Schema,
  Unsubscribe,
  UpdateData,
} from "@hatchifyjs/rest-client"
import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"
import { useCreateOne, useDeleteOne, useList, useOne, useUpdateOne } from ".."

export type ReactRest = {
  [schemaName: string]: {
    // promises
    createOne: (data: CreateData) => Promise<Record>
    deleteOne: (id: string) => Promise<void>
    getOne: (query: QueryOne) => Promise<Record>
    getList: (query: QueryList) => Promise<Record[]>
    updateOne: (data: UpdateData) => Promise<Record>
    // hooks
    useCreateOne: () => [(data: CreateData) => void, Meta, Record?]
    useDeleteOne: () => [(id: string) => void, Meta]
    useList: (query: QueryList) => [Record[], Meta]
    useOne: (query: QueryOne) => [Record | undefined, Meta]
    useUpdateOne: (id: string) => [(data: CreateData) => void, Meta, Record?]
    // subscribes
    subscribeToList: (callback: (data: Record[]) => void) => Unsubscribe
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
export function createReactRest(
  legacySchemas: { [schemaName: string]: LegacySchema },
  dataSource: Source,
): ReactRest {
  const storeKeys = Object.values(legacySchemas).map((schema) => schema.name)
  createStore(storeKeys)

  const schemas = Object.values(legacySchemas).reduce((acc, schema) => {
    acc[schema.name] = transformSchema(schema)
    return acc
  }, {} as globalThis.Record<string, Schema>)

  const functions = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name] = {
      // promises
      createOne: (data) => createOne(dataSource, schemas, schema, data),
      deleteOne: (id) => deleteOne(dataSource, schemas, schema, id),
      getList: (query) => getList(dataSource, schemas, schema, query),
      getOne: (query) => getOne(dataSource, schemas, schema, query),
      updateOne: (data) => updateOne(dataSource, schemas, schema, data),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, schemas, schema),
      useDeleteOne: () => useDeleteOne(dataSource, schemas, schema),
      useList: (query) => useList(dataSource, schemas, schema, query),
      useOne: (query) => useOne(dataSource, schemas, schema, query),
      useUpdateOne: () => useUpdateOne(dataSource, schemas, schema),
      // subscribes
      subscribeToList: (callback) => subscribeToList(schema.name, callback),
      subscribeToOne: (callback, id) =>
        subscribeToOne(schema.name, callback, id),
    }

    return acc
  }, {} as ReactRest)

  return functions
}
