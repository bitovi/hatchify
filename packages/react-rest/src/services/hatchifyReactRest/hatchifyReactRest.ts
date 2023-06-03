import {
  Schemas,
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
import type { Schema as LegacySchema } from "@hatchifyjs/hatchify-core"
import { useCreateOne, useDeleteOne, useAll, useOne, useUpdateOne } from ".."

export type ReactRest = {
  [schemaName: string]: {
    // promises
    createOne: (data: CreateData) => Promise<Record>
    deleteOne: (id: string) => Promise<void>
    findOne: (query: QueryOne) => Promise<Record>
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
export function hatchifyReactRest(
  legacySchemas: { [schemaName: string]: LegacySchema },
  dataSource: Source,
): ReactRest {
  const storeKeys = Object.values(legacySchemas).map((schema) => schema.name)
  createStore(storeKeys)

  const schemas = Object.values(legacySchemas).reduce((acc, schema) => {
    acc[schema.name] = transformSchema(schema)
    return acc
  }, {} as Schemas)

  const functions = Object.values(schemas).reduce((acc, schema) => {
    acc[schema.name] = {
      // promises
      createOne: (data) => createOne(dataSource, schemas, schema.name, data),
      deleteOne: (id) => deleteOne(dataSource, schemas, schema.name, id),
      findAll: (query) => findAll(dataSource, schemas, schema.name, query),
      findOne: (query) => findOne(dataSource, schemas, schema.name, query),
      updateOne: (data) => updateOne(dataSource, schemas, schema.name, data),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, schemas, schema.name),
      useDeleteOne: () => useDeleteOne(dataSource, schemas, schema.name),
      useAll: (query) => useAll(dataSource, schemas, schema.name, query),
      useOne: (query) => useOne(dataSource, schemas, schema.name, query),
      useUpdateOne: () => useUpdateOne(dataSource, schemas, schema.name),
      // subscribes
      subscribeToAll: (callback) => subscribeToAll(schema.name, callback),
      subscribeToOne: (callback, id) =>
        subscribeToOne(schema.name, callback, id),
    }

    return acc
  }, {} as ReactRest)

  return functions
}
