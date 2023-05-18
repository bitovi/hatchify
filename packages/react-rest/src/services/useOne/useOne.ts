import { useEffect, useState } from "react"
import { getOne, getRecords, subscribeToOne } from "@hatchifyjs/data-core"
import type {
  Meta,
  MetaData,
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
  const [error, setError] = useState<Error | undefined>(undefined)
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

  const status = error ? "error" : loading ? "loading" : "success"

  const meta: Meta = {
    status,
    error,
    isLoading: status === "loading",
    isDone: status === "success" || status === "error",
    isRejected: status === "error",
  }

  return [data, meta]
}

function getMeta(
  status: Meta["status"],
  isStale: boolean,
  meta: Meta["meta"],
  error: Meta["error"],
): Meta {
  if (status === "success") {
    return {
      status,
      meta,
      error: undefined,
      isDone: true,
      isLoading: false,
      isRejected: false,
      isRevalidating: false,
      isStale: false,
    }
  } else if (status === "loading") {
    return {
      status,
      meta,
      error: undefined,
      isDone: false,
      isLoading: true,
      isRejected: false,
      isRevalidating: isStale,
      isStale,
    }
  } else {
    return {
      status,
      meta,
      error,
      isDone: false,
      isLoading: false,
      isRejected: true,
      isRevalidating: false,
      isStale,
    }
  }
}
