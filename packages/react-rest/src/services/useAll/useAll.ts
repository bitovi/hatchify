import { useState, useEffect, useMemo, useCallback } from "react"
import { findAll, getMeta, subscribeToAll } from "@hatchifyjs/rest-client"

import type {
  Meta,
  MetaError,
  QueryList,
  Record,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Prevents useEffect loops when the user provides `{}` directly to the `useAll` hook.
 */
const useMemoizedQuery = (query: QueryList) => {
  return useMemo(() => {
    return query
  }, [query.sort, query.filter, query.page, query.include, query.fields])
}

/**
 * Fetches a list of records using the rest-client findAll function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useAll = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
): [Record[], Meta] => {
  const memoizedQuery = useMemoizedQuery(query)
  const [data, setData] = useState<Record[]>([])

  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAll = useCallback(() => {
    setLoading(true)
    findAll(dataSource, allSchemas, schemaName, memoizedQuery)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, allSchemas, schemaName, memoizedQuery])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    return subscribeToAll(schemaName, fetchAll)
  }, [schemaName, fetchAll])

  const meta: Meta = getMeta(error, loading, false, undefined)
  return [data, meta]
}
