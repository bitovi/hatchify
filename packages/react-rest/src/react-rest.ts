import { subscribeToList, getList, createStore } from "data-core"
import type { Source, QueryList, Record, Schema, Unsubscribe } from "data-core"
import { useList } from "./services/react-hooks"

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
    useList: (query: QueryList) => [Record[]]
    subscribeToList: (callback: (data: Record[]) => void) => Unsubscribe
  }
}

export function reactRest(reactSchemas: ReactSchemas): ReactRest {
  const functions = {} as ReactRest
  const storeKeys = Object.values(reactSchemas).map((rs) => rs.schema.name)
  createStore(storeKeys)

  Object.values(reactSchemas).forEach((reactSchema) => {
    const { schema, dataSource } = reactSchema
    functions[schema.name] = {
      getList: (query) => getList(dataSource, schema.resource, query),
      useList: (query) => useList(dataSource, schema.resource, query),
      subscribeToList: (callback) => subscribeToList(schema.name, callback),
    }
  })

  return functions
}
