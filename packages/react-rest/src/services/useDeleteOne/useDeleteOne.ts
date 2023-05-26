import { useState } from "react"
import { deleteOne, getMeta } from "@hatchifyjs/rest-client"
import type { Meta, MetaError, Schema, Source } from "@hatchifyjs/rest-client"

/**
 * Returns a function that delete a record using the rest-client updateOne,
 */
export const useDeleteOne = (
  dataSource: Source,
  schemas: globalThis.Record<string, Schema>,
  schema: Schema,
): [(id: string) => void, Meta] => {
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  function remove(id: string) {
    setLoading(true)
    deleteOne(dataSource, schemas, schema, id)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const meta = getMeta(error, loading, false, undefined)
  return [remove, meta]
}
