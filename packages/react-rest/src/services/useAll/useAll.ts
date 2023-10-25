import { useState, useEffect, useMemo, useCallback } from "react"
import { findAll, getMeta, subscribeToAll } from "@hatchifyjs/rest-client"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Filters,
  Meta,
  MetaError,
  QueryList,
  RecordType,
  RequestMetaData,
  RestClient,
} from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"

/**
 * Prevents useEffect loops when the user provides `{}` directly to the `useAll` hook.
 */
function useMemoByStringify(filterOrQuery: Filters): Filters
function useMemoByStringify(filterOrQuery: QueryList): QueryList
function useMemoByStringify(filterOrQuery: Filters | QueryList) {
  const stringifiedQuery = JSON.stringify(filterOrQuery)

  // todo: query (nested objects) are causing infinite re-renders, need a better solution
  return useMemo(() => {
    return filterOrQuery
  }, [stringifiedQuery])
}

/**
 * Fetches a list of records using the rest-client findAll function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useAll = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList,
  baseFilter?: Filters,
): [
  Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>>,
  Meta,
] => {
  const memoizedQuery = useMemoByStringify(query)
  const memoizedBaseFilter = useMemoByStringify(baseFilter)
  const [data, setData] = useState<
    Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>>
  >([])
  const [requestMeta, setRequestMeta] = useState<RequestMetaData>()
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAll = useCallback(() => {
    setLoading(true)
    findAll<TSchemas, TSchemaName>(
      dataSource,
      allSchemas,
      schemaName,
      memoizedQuery,
      memoizedBaseFilter,
    )
      .then(([data, requestMeta]) => {
        setError(undefined)
        setData(data)
        setRequestMeta(requestMeta)
      })
      .catch((error) => {
        setError(error)
        if (error instanceof Error) {
          throw error
        }
      })
      .finally(() => setLoading(false))
  }, [dataSource, allSchemas, schemaName, memoizedQuery, memoizedBaseFilter])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  useEffect(() => {
    return subscribeToAll<TSchemas, GetSchemaNames<TSchemas>>(
      schemaName,
      query,
      fetchAll,
    )
  }, [schemaName, fetchAll])

  const meta = useMemo(
    () => getMeta(error, loading, false, requestMeta),
    [error, loading, requestMeta],
  )

  return [data, meta]
}
