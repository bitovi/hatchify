import { useEffect, useState } from "react"
import {
  getMeta,
  getOne,
  getRecords,
  subscribeToOne,
} from "@hatchifyjs/data-core"
import type {
  Meta,
  MetaError,
  QueryOne,
  Record,
  Schema,
  Source,
} from "@hatchifyjs/data-core"

/**
 * Fetches a single records using the data-core getOne function,
 * subscribes to the store for updates to the record, returns the record.
 */
export const useOne = (
  dataSource: Source,
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

    getOne(dataSource, schema, { id: query.id, fields: query.fields })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [dataSource, schema, query.id, query.fields])

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
