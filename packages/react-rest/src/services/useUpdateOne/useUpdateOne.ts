import { useState } from "react"
import { updateOne, getMeta } from "@hatchifyjs/rest-client"
import type {
  UpdateData,
  Meta,
  MetaError,
  Record,
  Schemas,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Returns a function that updates a new record using the rest-client updateOne,
 * @todo metadata, and the last created record.
 */
export const useUpdateOne = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
): [(data: UpdateData) => void, Meta, Record?] => {
  const [data, setData] = useState<Record | undefined>(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  function update(data: UpdateData) {
    setLoading(true)
    updateOne(dataSource, allSchemas, schemaName, {
      ...data,
      __schema: schemaName,
    })
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const meta = getMeta(error, loading, false, undefined)
  return [update, meta, data]
}
