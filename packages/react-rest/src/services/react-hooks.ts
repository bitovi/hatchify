import { useState, useEffect } from "react"
import { createOne, getList, subscribeToList } from "data-core"
import type { CreateData, Meta, Source, Record, QueryList } from "data-core"
import { getRecords } from "data-core"

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
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    setLoading(true)
    getList(dataSource, schema, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query])

  useEffect(() => {
    return subscribeToList(schema, (records: Record[]) => setData(records))
  }, [schema])

  const status = (
    error ? "error" : loading ? "loading" : "success"
  ) as Meta["status"]
  const meta = {
    status,
    error,
    isLoading: status === "loading",
    isDone: status === "success",
    isRejected: status === "error",
  }

  return [data, meta]
}

/**
 * Returns a function that creates a new record using the data-core createOne,
 * @todo metadata, and the last created record.
 */
export const useCreateOne = (
  dataSource: Source,
  schema: string,
): [(data: CreateData) => void, Meta, Record?] => {
  const [data, setData] = useState<Record | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  function create(data: CreateData) {
    setLoading(true)
    createOne(dataSource, schema, data)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const status = (
    error ? "error" : loading ? "loading" : "success"
  ) as Meta["status"]
  const meta = {
    status,
    error,
    isLoading: status === "loading",
    isDone: status === "success",
    isRejected: status === "error",
  }

  return [create, meta, data]
}
