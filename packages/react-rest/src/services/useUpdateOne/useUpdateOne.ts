import { useCallback, useState } from "react"
import { updateOne, getMeta } from "@hatchifyjs/rest-client"
import type { PartialSchema } from "@hatchifyjs/core"
import type {
  GetSchemaNames,
  FinalSchemas,
  GetSchemaFromName,
  FlatUpdateType,
  RecordType,
  MetaError,
  RestClient,
  ContextualMeta,
} from "@hatchifyjs/rest-client"

type UpdateData<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = Omit<FlatUpdateType<GetSchemaFromName<TSchemas, TSchemaName>>, "__schema">

type UpdatedRecord<
  TSchemas extends Record<string, PartialSchema>,
  TSchemaName extends GetSchemaNames<TSchemas>,
> = RecordType<TSchemas, GetSchemaFromName<TSchemas, TSchemaName>> | undefined

/**
 * Returns a function that updates a new record using the rest-client updateOne,
 * @todo metadata, and the last created record.
 */
export const useUpdateOne = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  dataSource: RestClient<TSchemas, TSchemaName>,
  allSchemas: FinalSchemas,
  schemaName: TSchemaName,
): [
  (data: UpdateData<TSchemas, TSchemaName>) => void,
  ContextualMeta,
  UpdatedRecord<TSchemas, TSchemaName>,
] => {
  const [data, setData] =
    useState<UpdatedRecord<TSchemas, TSchemaName>>(undefined)
  const [meta, setMeta] = useState<ContextualMeta>(() => ({}))

  const update = useCallback(
    (data: UpdateData<TSchemas, TSchemaName>) => {
      updateOne<TSchemas, TSchemaName>(dataSource, allSchemas, schemaName, data)
        .then((data) => {
          setMeta((prev) => ({
            ...prev,
            [data.id]: getMeta(undefined, true, false, undefined),
          }))
          setData(data)
        })
        .catch((error: MetaError) => {
          setMeta((prev: ContextualMeta) => {
            return {
              ...prev,
              [data.id]: getMeta(error, false, false, undefined),
            }
          })
          if (error instanceof Error) {
            throw error
          }
        })
        .finally(() =>
          setMeta((prev: ContextualMeta) => {
            return {
              ...prev,
              [data.id]: getMeta(prev[data.id]?.error, false, false, undefined),
            }
          }),
        )
    },
    [dataSource, allSchemas, schemaName],
  )

  return [update, meta, data]
}
