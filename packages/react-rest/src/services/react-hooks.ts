import { useState, useEffect } from "react"
import { getList, subscribeToList } from "data-core"
import type { Source, Record, QueryList } from "data-core"

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
