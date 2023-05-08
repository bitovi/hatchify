import { useState, useEffect } from "react"
import { getList, subscribeToList } from "data-core"
import type { CreateData, Source, Record, QueryList } from "data-core"

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
    const unsubscribe = subscribeToList(schema, (records: Record[]) =>
      setData(records),
    )

    return () => unsubscribe()
  }, [schema])

  return [data]
}

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
