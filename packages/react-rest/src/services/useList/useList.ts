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
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Fetches a list of records using the rest-client getList function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useList = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
): [Record[], Meta] => {
  const defaultData = getRecords(schemaName)
  const [data, setData] = useState<Record[]>(defaultData)

  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getList(dataSource, allSchemas, schemaName, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schemaName, query])

  useEffect(() => {
    return subscribeToList(schemaName, (records: Record[]) => setData(records))
  }, [schemaName])

  const meta: Meta = getMeta(error, loading, false, undefined)
  return [data, meta]
}
