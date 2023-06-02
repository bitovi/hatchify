import { useEffect, useState } from "react"
import {
  getMeta,
  findOne,
  getRecords,
  subscribeToOne,
} from "@hatchifyjs/rest-client"
import type {
  Meta,
  MetaError,
  QueryOne,
  Record,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Fetches a single records using the rest-client findOne function,
 * subscribes to the store for updates to the record, returns the record.
 */
export const useOne = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
  query: QueryOne,
): [Record | undefined, Meta] => {
  const defaultData = getRecords(schemaName)
  const record = defaultData.find((record: Record) => record.id === query.id)

  const [data, setData] = useState<Record | undefined>(record)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)

    findOne(dataSource, allSchemas, schemaName, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schemaName, query])

  useEffect(() => {
    return subscribeToOne(
      schemaName,
      (record: Record) => setData(record),
      query.id,
    )
  }, [schemaName, query.id])

  const meta: Meta = getMeta(error, loading, false, undefined)
  return [data, meta]
}
