import { useEffect, useState } from "react"
import { getOne, getRecords, subscribeToOne } from "data-core"
import type { Meta, QueryOne, Record, Source } from "data-core"

/**
 * Fetches a single records using the data-core getOne function,
 * subscribes to the store for updates to the record, returns the record.
 */
export const useOne = (
  dataSource: Source,
  schema: string,
  query: QueryOne,
): [Record | undefined, Meta] => {
  const defaultData = getRecords(schema)
  const record = defaultData.find((record: Record) => record.id === query.id)
  const [data, setData] = useState<Record | undefined>(record)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getOne(dataSource, schema, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query.fields, query.id])

  useEffect(() => {
    return subscribeToOne(schema, (record: Record) => setData(record), query.id)
  }, [schema, query.id])

  const status = (
    error ? "error" : loading ? "loading" : "success"
  ) as Meta["status"]
  const meta = {
    status,
    error,
    loading,
    isLoading: status === "loading",
    isDone: status === "success",
    isRejected: status === "error",
  }

  return [data, meta]
}
