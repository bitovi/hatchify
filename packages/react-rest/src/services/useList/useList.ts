import { getList, getRecords, subscribeToList } from "@hatchifyjs/data-core"
import { useState, useEffect } from "react"
import type { Meta, Source, Record, QueryList } from "@hatchifyjs/data-core"

/**
 * Fetches a list of records using the data-core getList function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useList = (
  dataSource: Source,
  schema: string,
  query: QueryList,
): [Record[], Meta] => {
  const defaultData = getRecords(schema)
  const [data, setData] = useState<Record[]>(defaultData)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)
    getList(dataSource, schema, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query.fields, query.filter, query.sort, query.page])

  useEffect(() => {
    return subscribeToList(schema, (records: Record[]) => setData(records))
  }, [schema])

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
