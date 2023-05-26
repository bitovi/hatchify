import { useEffect, useState } from "react"
import {
  getMeta,
  getOne,
  getRecords,
  subscribeToOne,
} from "@hatchifyjs/rest-client"
import type {
  Meta,
  MetaError,
  QueryOne,
  Record,
  Schema,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Fetches a single records using the rest-client getOne function,
 * subscribes to the store for updates to the record, returns the record.
 */
export const useOne = (
  dataSource: Source,
  schemas: globalThis.Record<string, Schema>,
  schema: Schema,
  query: QueryOne,
): [Record | undefined, Meta] => {
  const defaultData = getRecords(schema.name)
  const record = defaultData.find((record: Record) => record.id === query.id)

  const [data, setData] = useState<Record | undefined>(record)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setLoading(true)

    getOne(dataSource, schemas, schema, query)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query])

  useEffect(() => {
    return subscribeToOne(
      schema.name,
      (record: Record) => setData(record),
      query.id,
    )
  }, [schema, query.id])

  const meta: Meta = getMeta(error, loading, false, undefined)
  return [data, meta]
}
