import { useCallback, useMemo, useState } from "react"
import { deleteOne, getMeta } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaNames,
  Meta,
  MetaError,
  Source,
} from "@hatchifyjs/rest-client"

/**
 * Returns a function that delete a record using the rest-client updateOne,
 */
export const useDeleteOne = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: Source,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
): [(id: string) => void, Meta] => {
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const remove = useCallback(
    (id: string) => {
      setLoading(true)
      deleteOne<TSchemas, GetSchemaNames<TSchemas>>(
        dataSource,
        allSchemas,
        schemaName,
        id,
      )
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

  const meta = useMemo(
    () => getMeta(error, loading, false, undefined),
    [error, loading],
  )

  return [remove, meta]
}
