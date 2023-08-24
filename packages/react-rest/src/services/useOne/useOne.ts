import { useCallback, useEffect, useMemo, useState } from "react"
import { getMeta, findOne, subscribeToAll } from "@hatchifyjs/rest-client"

import type {
  Meta,
  MetaError,
  QueryOne,
  Record,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

const useMemoizedQuery = (query: QueryOne) => {
  const stringifiedQuery = JSON.stringify(query)

  return useMemo(() => {
    return query
  }, [stringifiedQuery])
}

/**
 * Fetches a single records using the rest-client findOne function,
 * subscribes to the store for updates to the record, returns the record.
 */
export const useOne = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryOne | string,
): [Record | undefined, Meta] => {
  const memoizedQuery = useMemoizedQuery(
    typeof query === "string" ? { id: query } : { ...query },
  )

  const [data, setData] = useState<Record | undefined>(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchOne = useCallback(() => {
    setLoading(true)

    findOne(dataSource, allSchemas, schemaName, memoizedQuery)
      .then((data) => {
        setError(undefined)
        setData(data)
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
    fetchOne()
  }, [fetchOne])

  useEffect(() => {
    // todo: should use subscribeToOne here once store + can-query-logic is implemented
    // for now, subscribe to any change and refetch data
    return subscribeToAll(schemaName, undefined, fetchOne)
  }, [schemaName, fetchOne, memoizedQuery.id])

  const meta = useMemo(
    () => getMeta(error, loading, false, undefined),
    [error, loading],
  )

  return [data, meta]
}
