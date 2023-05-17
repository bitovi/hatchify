import {
  createOne,
  createStore,
  getList,
  getOne,
  subscribeToList,
  subscribeToOne,
  transformSchema,
} from "data-core"
import type {
  CreateData,
  Meta,
  Source,
  QueryList,
  QueryOne,
  Record,
  Schema,
  Unsubscribe,
} from "data-core"
import { useCreateOne, useList, useOne } from ".."

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
    getOne: (query: QueryOne) => Promise<Record>
    getList: (query: QueryList) => Promise<Record[]>
    // hooks
    useCreateOne: () => [(data: CreateData) => void, Meta, Record?]
    useList: (query: QueryList) => [Record[], Meta]
    useOne: (query: QueryOne) => [Record | undefined, Meta]
    // subscribes
    subscribeToList: (callback: (data: Record[]) => void) => Unsubscribe
    subscribeToOne: (
      callback: (data: Record) => void,
      id: string,
    ) => Unsubscribe
  }
}

/**
 * Returns a set of functions for interacting with the data-core store and
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
      getList: (query) => getList(dataSource, schema, query),
      getOne: (query) => getOne(dataSource, schema, query),
      // hooks
      useCreateOne: () => useCreateOne(dataSource, schema),
      useList: (query) => useList(dataSource, schema, query),
      useOne: (query) => useOne(dataSource, schema, query),
      // subscribes
      subscribeToList: (callback) => subscribeToList(schema, callback),
      subscribeToOne: (callback, id) => subscribeToOne(schema, callback, id),
    }

    return acc
  }, {} as ReactRest)

  return functions
}
