import { subscribeToList, getList, createOne, createStore } from "data-core"
import type {
  CreateData,
  Source,
  QueryList,
  Record,
  Schema,
  Unsubscribe,
} from "data-core"
import { useCreateOne, useList } from "./services/react-hooks"

export interface ReactSchema {
  schema: Schema
  dataSource: Source
}

export type ReactSchemas = {
  [schemaName: string]: ReactSchema
}

export type ReactRest = {
  [schemaName: string]: {
    getList: (query: QueryList) => Promise<Record[]>
    createOne: (data: CreateData) => Promise<Record>
    useList: (query: QueryList) => [Record[]]
    useCreateOne: () => [(data: CreateData) => void, any, Record?]
    subscribeToList: (callback: (data: Record[]) => void) => Unsubscribe
  }
}

/**
 * Returns a set of functions for interacting with the data-core store and
 * data source for each schema.
 */
export function reactRest(reactSchemas: ReactSchemas): ReactRest {
  const storeKeys = Object.values(reactSchemas).map((rs) => rs.schema.name)
  createStore(storeKeys)

  const functions = Object.values(reactSchemas).reduce((acc, reactSchema) => {
    const { schema, dataSource } = reactSchema

    acc[schema.name] = {
      getList: (query) => getList(dataSource, schema.name, query),
      createOne: (data) => createOne(dataSource, schema.name, data),
      useList: (query) => useList(dataSource, schema.name, query),
      useCreateOne: () => useCreateOne(dataSource, schema.name),
      subscribeToList: (callback) => subscribeToList(schema.name, callback),
    }

    return acc
  }, {} as ReactRest)

  return functions
}
