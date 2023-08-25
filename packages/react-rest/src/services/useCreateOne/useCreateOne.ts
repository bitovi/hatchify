import { useCallback, useMemo, useState } from "react"
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

  const create = useCallback(
    (data: CreateData) => {
      setLoading(true)
      createOne(dataSource, allSchemas, schemaName, {
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

  return [create, meta, data]
}
