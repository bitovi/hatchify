import { useState, useEffect } from "react"
import { getList, subscribeToList } from "data-core"
import type { CreateData, Source, Record, QueryList } from "data-core"

/**
 * Fetches a list of records using the data-core getList function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useList = (
  dataSource: Source,
  schema: string,
  query: QueryList,
): [Record[]] => {
  const [data, setData] = useState<Record[]>([]) // @todo default to what's in the store

  useEffect(() => {
    getList(dataSource, schema, query).then(setData)
  }, [dataSource, schema, query])

  useEffect(() => {
    return subscribeToList(schema, (records: Record[]) => setData(records))
  }, [schema])

  return [data]
}

/**
 * Returns a function that creates a new record using the data-core createOne,
 * @todo metadata, and the last created record.
 */
export const useCreateOne = (
  dataSource: Source,
  schema: string,
): [(data: CreateData) => void, any, Record?] => {
  const [data, setData] = useState<Record | undefined>(undefined)

  function createOne(data: CreateData) {
    dataSource.createOne(schema, data).then((data) => setData(data.data))
    // .catch(setError)
  }

  return [createOne, undefined, data]
}
