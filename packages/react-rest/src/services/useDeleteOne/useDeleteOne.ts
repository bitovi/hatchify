import { useCallback, useState } from "react"
import { deleteOne, getMeta } from "@hatchifyjs/rest-client"
import type { Meta, MetaError, Schemas, Source } from "@hatchifyjs/rest-client"

/**
 * Returns a function that delete a record using the rest-client updateOne,
 */
export const useDeleteOne = (
  dataSource: Source,
  allSchemas: Schemas,
  schemaName: string,
): [(id: string) => void, Meta] => {
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const remove = useCallback(
    (id: string) => {
      setLoading(true)
      deleteOne(dataSource, allSchemas, schemaName, id)
        .then(() => setError(undefined))
        .catch((error) => {
          setError(error)
          if (error instanceof Error) {
            throw error
          }
        })
        .finally(() => setLoading(false))
    },
    [dataSource, allSchemas, schemaName],
  )

  const meta = getMeta(error, loading, false, undefined)
  return [remove, meta]
}
