import { useState, useEffect } from "react"
import {
  getList,
  getMeta,
  getRecords,
  subscribeToList,
} from "@hatchifyjs/rest-client"
import type {
  Meta,
  MetaError,
  QueryList,
  Record,
  Schema,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Fetches a list of records using the rest-client getList function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useList = (
  dataSource: Source,
  schemas: globalThis.Record<string, Schema>,
  schema: Schema,
  query: QueryList,
): [Record[], Meta] => {
  const defaultData = getRecords(schema.name)
  const [data, setData] = useState<Record[]>(defaultData)

  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getList(dataSource, schemas, schema, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query])

  useEffect(() => {
    return subscribeToList(schema.name, (records: Record[]) => setData(records))
  }, [schema])

  const meta: Meta = getMeta(error, loading, false, undefined)
  return [data, meta]
}
