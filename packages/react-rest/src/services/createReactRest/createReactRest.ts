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
  Unsubscribe,
  UpdateData,
} from "@hatchifyjs/rest-client"
import type { Schema } from "@hatchifyjs/hatchify-core"
import { useCreateOne, useDeleteOne, useList, useOne, useUpdateOne } from ".."

export interface ReactSchema {
  schema: Schema
  dataSource: Source
}

export type ReactSchemas = {
  [schemaName: string]: ReactSchema
}

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
export function createReactRest(reactSchemas: ReactSchemas): ReactRest {
  const storeKeys = Object.values(reactSchemas).map((rs) => rs.schema.name)
  createStore(storeKeys)

  const functions = Object.values(reactSchemas).reduce((acc, reactSchema) => {
    const { schema: oldSchema, dataSource } = reactSchema
    const schema = transformSchema(oldSchema)

    acc[schema.name] = {
      // promises
      createOne: (data) => createOne(dataSource, schema, data),
      deleteOne: (id) => deleteOne(dataSource, schema, id),
      getList: (query) => getList(dataSource, schema, query),
      getOne: (query) => getOne(dataSource, schema, query),
      updateOne: (data) => updateOne(dataSource, schema, data),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, schema),
      useDeleteOne: () => useDeleteOne(dataSource, schema),
      useList: (query) => useList(dataSource, schema, query),
      useOne: (query) => useOne(dataSource, schema, query),
      useUpdateOne: () => useUpdateOne(dataSource, schema),
      // subscribes
      subscribeToList: (callback) => subscribeToList(schema.name, callback),
      subscribeToOne: (callback, id) =>
        subscribeToOne(schema.name, callback, id),
    }

    return acc
  }, {} as ReactRest)

  return functions
}
