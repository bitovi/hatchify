import { useState, useEffect, useMemo } from "react"
import {
  findAll,
  getMeta,
  getRecords,
  subscribeToAll,
} from "@hatchifyjs/rest-client"
import type {
  Meta,
  MetaError,
  QueryList,
  Record,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

const useMemoizedQuery = (query: QueryList) => {
  return useMemo(() => {
    return query
  }, [query.sort, query.filter, query.page, query.include, query.fields])
}

/**
 * Fetches a list of records using the rest-client findAll function,
 * subscribes to the store for updates to the list, returns the list.
 */
export const useAll = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryList,
): [Record[], Meta] => {
  const memQuery = useMemoizedQuery(query)
  const defaultData = getRecords(schemaName)
  const [data, setData] = useState<Record[]>(defaultData)

  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)
  const fetchAll = ()=> {
    setLoading(true)
    findAll(dataSource, allSchemas, schemaName, memQuery)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }
  
  useEffect(() => {
    fetchAll();
  }, [dataSource, allSchemas, schemaName, memQuery, fetchAll])

  // todo: Dan - when notified, refetch data from datasource (backend)
  // useEffect(() => {
  //   return fetchAll()
  // }, [datasource])

  const meta: Meta = getMeta(error, loading, false, undefined)
  return [data, meta]
}


