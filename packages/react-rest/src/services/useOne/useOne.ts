import { useCallback, useEffect, useMemo, useState } from "react"
import { getMeta, findOne, subscribeToAll } from "@hatchifyjs/rest-client"

import type {
  Meta,
  MetaError,
  QueryOne,
  PartialSchemas,
  GetSchemaNames,
  FinalSchemas,
  RecordType,
  GetSchemaFromName,
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
export const useOne = <
  const TSchemas extends PartialSchemas,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  query: QueryOne | string,
): [RecordType<GetSchemaFromName<TSchemas, TSchemaName>> | undefined, Meta] => {
  const memoizedQuery = useMemoizedQuery(
    typeof query === "string" ? { id: query } : { ...query },
  )

  const [data, setData] = useState<
    RecordType<GetSchemaFromName<TSchemas, TSchemaName>> | undefined
  >(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchOne = useCallback(() => {
    setLoading(true)

    findOne<TSchemas, GetSchemaNames<TSchemas>>(
      dataSource,
      allSchemas,
      schemaName,
      memoizedQuery,
    )
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
    return subscribeToAll<TSchemas, GetSchemaNames<TSchemas>>(
      schemaName,
      undefined,
      fetchOne,
    )
  }, [schemaName, fetchOne, memoizedQuery.id])

  const meta = useMemo(
    () => getMeta(error, loading, false, undefined),
    [error, loading],
  )

  return [data, meta]
}
