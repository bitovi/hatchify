import { useState, useEffect } from "react"
import { getList, getStore, subscribeToList } from "data"
import type { DataSource, Record, QueryList } from "source-jsonapi"

export const useList = (
  dataSource: DataSource,
  resource: string,
  query: QueryList,
): [Record[]] => {
  const [data, setData] = useState(
    Object.values(getStore(resource)?.data ?? []),
  )

  useEffect(() => {
    getList(dataSource, resource, query).then((records) =>
      setData(Object.values(records)),
    )
  }, [resource, query])

  useEffect(() => {
    const unsubscribe = subscribeToList(resource, (records) => {
      setData(Object.values(records))
    })

    return () => unsubscribe()
  }, [resource])

  return [data]
}

export const useCreateOne = (
  dataSource: DataSource,
  resource: string,
): [(data: Omit<Record, "id">) => Promise<Record>, any, Record?] => {
  const [data, setData] = useState<Record>()

  const createOne = async (data: Omit<Record, "id">) => {
    const record = await dataSource.createOne(resource, data)

    setData(record.data)
  }

  return [createOne, undefined, data]
}
