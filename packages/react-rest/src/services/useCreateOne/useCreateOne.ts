import { useCallback, useMemo, useState } from "react"
import { createOne, getMeta } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  FinalSchemas,
  GetSchemaFromName,
  GetSchemaNames,
  RecordType,
  Meta,
  MetaError,
  RestClient,
  FlatCreateType,
  MutateOptions,
} from "@hatchifyjs/rest-client"

type CreateData<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = Omit<FlatCreateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">

type CreatedRecord<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>> | undefined

/**
 * Returns a function that creates a new record using the rest-client createOne,
 * @todo metadata, and the last created record.
 */
export const useCreateOne = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  mutateOptions?: MutateOptions<TSchemas>,
): [
  (data: CreateData<TSchemas, TSchemaName>) => void,
  Meta,
  CreatedRecord<TSchemas, TSchemaName>,
] => {
  const [data, setData] =
    useState<CreatedRecord<TSchemas, TSchemaName>>(undefined)
  const [error, setError] = useState<MetaError | undefined>(undefined)
  const [loading, setLoading] = useState<boolean>(false)

  const create = useCallback(
    (data: CreateData<TSchemas, TSchemaName>) => {
      setLoading(true)
      createOne<TSchemas, TSchemaName>(
        dataSource,
        allSchemas,
        schemaName,
        data,
        mutateOptions,
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
    [dataSource, allSchemas, schemaName, mutateOptions],
  )

  const meta = useMemo(
    () => getMeta(error, loading, false, undefined),
    [error, loading],
  )

  return [create, meta, data]
}
