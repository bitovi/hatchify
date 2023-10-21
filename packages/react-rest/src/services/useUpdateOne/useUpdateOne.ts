import { useCallback, useMemo, useState } from "react"
import { updateOne, getMeta } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  GetSchemaNames,
  FinalSchemas,
  GetSchemaFromName,
  UpdateType,
  RecordType,
  Meta,
  MetaError,
  RestClient,
} from "@hatchifyjs/rest-client"

type UpdateData<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = Omit<UpdateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">

type UpdatedRecord<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> =
  | RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>>
  | undefined
  | null

/**
 * Returns a function that updates a new record using the rest-client updateOne,
 * @todo metadata, and the last created record.
 */
export const useUpdateOne = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
): [
  (data: UpdateData<TSchemas, TSchemaName>) => void,
  Meta,
  UpdatedRecord<TSchemas, TSchemaName>,
] => {
  const [data, setData] =
    useState<UpdatedRecord<TSchemas, TSchemaName>>(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const update = useCallback(
    (data: UpdateData<TSchemas, TSchemaName>) => {
      setLoading(true)
      updateOne<TSchemas, GetSchemaNames<TSchemas>>(
        dataSource,
        allSchemas,
        schemaName,
        data,
      )
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
