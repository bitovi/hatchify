import { useState, useEffect, useMemo, useCallback } from "react"
import { findAll, getMeta, subscribeToAll } from "@hatchifyjs/rest-client"

import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  Meta,
  MetaError,
  QueryList,
  Record,
  RecordType,
  RequestMetaData,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"
import { PartialSchema } from "@hatchifyjs/hatchify-core"

/**
 * Prevents useEffect loops when the user provides `{}` directly to the `useAll` hook.
 */
const useMemoizedQuery = (query: QueryList) => {
  const stringifiedQuery = JSON.stringify(query)

  // todo: query (nested objects) are causing infinite re-renders, need a better solution
  return useMemo(() => {
    return query
  }, [stringifiedQuery])
}

/**
 * Fetches a list of records using the rest-client findAll function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useAll = <
  const TSchemas extends globalThis.Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryList,
): [RecordType<GetSchemaFromName<TSchemas, TSchemaName>>[], Meta] => {
  const memoizedQuery = useMemoizedQuery(query)
  const [data, setData] = useState<
    RecordType<GetSchemaFromName<TSchemas, TSchemaName>>[]
  >([])
  const [requestMeta, setRequestMeta] = useState<RequestMetaData>()
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchAll = useCallback(() => {
    setLoading(true)
    findAll<TSchemas, GetSchemaNames<TSchemas>>(
      dataSource,
      allSchemas,
      schemaName,
      memoizedQuery,
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
  }, [dataSource, allSchemas, schemaName, memoizedQuery])

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

  const meta = getMeta(error, loading, false, requestMeta)
  return [data, meta]
}
