import { useCallback, useState, useEffect } from "react"
import {
  createOne,
  getList,
  getOne,
  getRecords,
  subscribeToList,
  subscribeToOne,
} from "data-core"
import type {
  CreateData,
  Meta,
  Source,
  Record,
  QueryList,
  QueryOne,
} from "data-core"

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

  const getListCallback = useCallback(() => {
    setLoading(true)
    getList(dataSource, schema, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query])

  useEffect(() => {
    getListCallback()
  }, [])

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
  }, [dataSource, schema, query])

  useEffect(() => {
    return subscribeToOne(schema, (record: Record) => setData(record), query.id)
  }, [query.id])

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
