import { subscribeToList, getList, createStore } from "data"
import type { QueryList, Record } from "source-jsonapi"
import type { Unsubscribe } from "data"
import { useList } from "./services/react-hooks"

export type Schema = {
  name: string // "Article"
  resource: string // "articles"
  displayAttribute: string // "title"
  attributes: {
    [field: string]: string | { type: string }
  }
  relationships?: {
    [field: string]: {
      type: "many" | "one"
      schema: string
    }
  }
}

export type Schemas = {
  [schemaName: string]: Schema
}

export type ReactRest = {
  [schemaName: string]: {
    getList: (query: QueryList) => Promise<Record[]>
    useList: (query: QueryList) => [Record[]]
    subscribeToList: (callback: (data: Record[]) => void) => Unsubscribe
  }
}

export function reactRest(schemas: Schemas): ReactRest {
  createStore(Object.values(schemas).map((schema) => schema.resource))
  const functions = {} as ReactRest

  Object.values(schemas).forEach((schemas) => {
    functions[schemas.name] = {
      getList: (query) => getList(schemas.resource, query),
      useList: (query) => useList(schemas.resource, query),
      subscribeToList: (callback) => subscribeToList(schemas.name, callback),
    }
  })

  return functions
}
