import { useState } from "react"
import { createOne, getMeta } from "@hatchifyjs/rest-client"
import type {
  CreateData,
  Meta,
  MetaError,
  Record,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Returns a function that creates a new record using the rest-client createOne,
 * @todo metadata, and the last created record.
 */
export const useCreateOne = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
): [(data: CreateData) => void, Meta, Record?] => {
  const [data, setData] = useState<Record | undefined>(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  function create(data: CreateData) {
    setLoading(true)
    createOne(dataSource, allSchemas, schemaName, {
      ...data,
      __schema: schemaName,
    })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const meta = getMeta(error, loading, false, undefined)
  return [create, meta, data]
}
