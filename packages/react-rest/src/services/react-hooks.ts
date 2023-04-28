import { useState, useEffect } from "react"
import { getList, getStore, subscribeToList } from "data"
import type { Record, QueryList } from "source-jsonapi"

export const useList = (resource: string, query: QueryList): [Record[]] => {
  const [data, setData] = useState(
    Object.values(getStore(resource)?.data ?? []),
  )

  useEffect(() => {
    getList(resource, query).then((records) => setData(Object.values(records)))
  }, [resource, query])

  useEffect(() => {
    const unsubscribe = subscribeToList(resource, (records) => {
      setData(Object.values(records))
    })

    return () => unsubscribe()
  }, [resource])

  return [data]
}
