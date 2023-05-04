import { useState, useEffect } from "react"
import { getList, getStore, subscribeToList } from "data-core"
import type { Source, Record, QueryList } from "data-core"

export const useList = (
  dataSource: Source,
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
