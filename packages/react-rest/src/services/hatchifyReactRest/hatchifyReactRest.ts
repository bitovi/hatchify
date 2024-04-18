import type { PartialSchema } from "@hatchifyjs/core"
import { assembler, getSchemaKey } from "@hatchifyjs/core"
import type {
  GetSchemaFromName,
  GetSchemaNames,
  RecordType,
  RestClient,
  Filters,
  Meta,
  QueryList,
  QueryOne,
  RequestMetaData,
  FlatCreateType,
  FlatUpdateType,
  ContextualMeta,
  MutateOptions,
} from "@hatchifyjs/rest-client"
import {
  createStore,
  createOne,
  deleteOne,
  updateOne,
  findAll,
  findOne,
} from "@hatchifyjs/rest-client"
import {
  useAll,
  useCreateOne,
  useOne,
  useUpdateOne,
  useDeleteOne,
} from "../index.js"

export type HatchifyReactRest<TSchemas extends Record<string, PartialSchema>> =
  {
    [SchemaName in keyof TSchemas]: {
      // promises
      findAll: (
        query?: QueryList<GetSchemaFromName<TSchemas, SchemaName>>,
      ) => Promise<
        [
          Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>>,
          RequestMetaData,
        ]
      >
      findOne: (
        query: QueryOne<GetSchemaFromName<TSchemas, SchemaName>> | string,
      ) => Promise<
        | RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
        | undefined
      >
      createOne: (
        data: Omit<
          FlatCreateType<GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
        mutateOptions?: MutateOptions<TSchemas>,
      ) => Promise<
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
      >
      updateOne: (
        data: Omit<
          FlatUpdateType<GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
        mutateOptions?: MutateOptions<TSchemas>,
      ) => Promise<
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
      >
      deleteOne: (
        id: string,
        mutateOptions?: MutateOptions<TSchemas>,
      ) => Promise<void>
      // hooks
      useAll: (
        query?: QueryList<GetSchemaFromName<TSchemas, SchemaName>>,
        baseFilter?: Filters,
        minimumLoadTime?: number,
      ) => [
        Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>>,
        Meta,
      ]
      useOne: (
        query: QueryOne<GetSchemaFromName<TSchemas, SchemaName>> | string,
      ) => [
        (
          | RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
          | undefined
        ),
        Meta,
      ]
      useCreateOne: <TMutateOptions extends MutateOptions<TSchemas>>(
        mutateOptions?: TMutateOptions,
      ) => [
        (
          data: Omit<
            FlatCreateType<GetSchemaFromName<TSchemas, SchemaName>>,
            "__schema"
          >,
        ) => void,
        Meta,
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>?,
      ]
      useUpdateOne: <TMutateOptions extends MutateOptions<TSchemas>>(
        mutateOptions?: TMutateOptions,
      ) => [
        (
          data: Omit<
            FlatUpdateType<GetSchemaFromName<TSchemas, SchemaName>>,
            "__schema"
          >,
        ) => void,
        ContextualMeta,
        (
          | RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
          | null
          | undefined
        ),
      ]
      useDeleteOne: <TMutateOptions extends MutateOptions<TSchemas>>(
        mutateOptions?: TMutateOptions,
      ) => [(id: string) => void, ContextualMeta]
      // subscribes
      // subscribeToAll: (
      //   query: QueryList | undefined,
      //   callback: (
      //     records: Array<RecordType<GetSchemaFromName<TSchemas, SchemaName>>>,
      //   ) => void,
      // ) => Unsubscribe
    }
  }

export const hatchifyReactRest = <
  const TSchemas extends Record<string, PartialSchema>,
  const TSchemaName extends GetSchemaNames<TSchemas>,
>(
  // partialSchemas: TSchemas,
  restClient: RestClient<TSchemas, TSchemaName>,
): HatchifyReactRest<TSchemas> => {
  const { completeSchemaMap: partialSchemas } = restClient
  const finalSchemas = assembler(partialSchemas)
  const storeKeys = Object.values(finalSchemas).map(getSchemaKey)
  createStore(storeKeys)

  const functions = Object.entries(partialSchemas).reduce(
    (acc, [schemaName, schema]) => {
      const key = schemaName as keyof typeof acc
      const typedSchemaName = schemaName as TSchemaName
      acc[key] = {
        // promises
        findAll: (query) =>
          findAll<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            query || {},
          ),
        findOne: (query) =>
          findOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            query,
          ),
        createOne: (data, mutateOptions) =>
          createOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            data,
            mutateOptions,
          ),
        updateOne: (data, mutateOptions) =>
          updateOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            data,
            mutateOptions,
          ),
        deleteOne: (id, mutateOptions) =>
          deleteOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            id,
            mutateOptions,
          ),
        // hooks
        useAll: (query, baseFilter, minimumLoadTime) =>
          useAll<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            query ?? {},
            baseFilter,
            minimumLoadTime,
          ),
        useOne: (query) =>
          useOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            query,
          ),
        useCreateOne: (mutateOptions) =>
          useCreateOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            mutateOptions,
          ),
        useUpdateOne: (mutateOptions) =>
          useUpdateOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            mutateOptions,
          ),
        useDeleteOne: (mutateOptions) =>
          useDeleteOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            mutateOptions,
          ),
      }

      return acc
    },
    {} as HatchifyReactRest<TSchemas>,
  )

  return functions
}
