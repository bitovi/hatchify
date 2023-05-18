import { getList, getRecords, subscribeToList } from "@hatchifyjs/data-core"
import { useState, useEffect } from "react"
import type {
  Meta,
  QueryList,
  Record,
  Schema,
  Source,
} from "@hatchifyjs/data-core"

/**
 * Fetches a list of records using the data-core getList function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useList = (
  dataSource: Source,
  schema: Schema,
  query: QueryList,
): [Record[], Meta] => {
  const defaultData = getRecords(schema.name)
  const [data, setData] = useState<Record[]>(defaultData)

  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  // @todo in test this infinitely loops if deps array is just `query`??
  useEffect(() => {
    setLoading(true)

    getList(dataSource, schema, {
      fields: query.fields,
      filter: query.filter,
      sort: query.sort,
      page: query.page,
    })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query.fields, query.filter, query.sort, query.page])

  useEffect(() => {
    return subscribeToList(schema.name, (records: Record[]) => setData(records))
  }, [schema])

  const status = error ? "error" : loading ? "loading" : "success"

  const meta: Meta = {
    status,
    error,
    isLoading: status === "loading",
    isDone: status === "success",
    isRejected: status === "error",
  }

  return [data, meta]
}
