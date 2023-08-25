import { useCallback, useMemo, useState } from "react"
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
): [(data: UpdateData) => void, Meta, Record | undefined | null] => {
  const [data, setData] = useState<Record | undefined | null>(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const update = useCallback(
    (data: UpdateData) => {
      setLoading(true)
      updateOne(dataSource, allSchemas, schemaName, {
        ...data,
        __schema: schemaName,
      })
        .then((data) => {
          setError(undefined)
          setData(data)
        })
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

  return [update, meta, data]
}
