import { useCallback, useState } from "react"
import type { PartialSchema } from "@hatchifyjs/core"
import { deleteOne, getMeta } from "@hatchifyjs/rest-client"
import type {
  ContextualMeta,
  FinalSchemas,
  GetSchemaNames,
  MetaError,
  MutateOptions,
  RestClient,
} from "@hatchifyjs/rest-client"

/**
 * Returns a function that delete a record using the rest-client deleteOne,
 */
export const useDeleteOne = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
  mutateOptions?: MutateOptions<TSchemas>,
): [(id: string) => void, ContextualMeta] => {
  const [meta, setMeta] = useState<ContextualMeta>(() => ({}))

  const remove = useCallback(
    (id: string) => {
      setMeta((prev) => ({
        ...prev,
        [id]: getMeta(undefined, true, true, undefined),
      }))
      deleteOne<TSchemas, TSchemaName>(
        dataSource,
        allSchemas,
        schemaName,
        id,
        mutateOptions,
      )
        .then(() =>
          setMeta((prev: ContextualMeta) => ({
            ...prev,
            [id]: getMeta(undefined, true, false, undefined),
          })),
        )
        .catch((error: MetaError) => {
          setMeta((prev: ContextualMeta) => ({
            ...prev,
            [id]: getMeta(error, false, false, undefined),
          }))
          if (error instanceof Error) {
            throw error
          }
        })
        .finally(() =>
          setMeta((prev: ContextualMeta) => ({
            ...prev,
            [id]: getMeta(prev[id]?.error, false, false, undefined),
          })),
        )
    },
    [dataSource, allSchemas, schemaName, mutateOptions],
  )

  return [remove, meta]
}
