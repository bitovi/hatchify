import { useState } from "react"
import { createOne } from "@hatchifyjs/data-core"
import type {
  CreateData,
  Meta,
  Record,
  Schema,
  Source,
} from "@hatchifyjs/data-core"

/**
 * Returns a function that creates a new record using the data-core createOne,
 * @todo metadata, and the last created record.
 */
export const useCreateOne = (
  dataSource: Source,
  schema: Schema,
): [(data: CreateData) => void, Meta, Record?] => {
  const [data, setData] = useState<Record | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  function create(data: CreateData) {
    setLoading(true)
    createOne(dataSource, schema, data)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const status = (
    error ? "error" : loading ? "loading" : "success"
  ) as Meta["status"]
  const meta = {
    status,
    error,
    isLoading: status === "loading",
    isDone: status === "success",
    isRejected: status === "error",
  }

  return [create, meta, data]
}
