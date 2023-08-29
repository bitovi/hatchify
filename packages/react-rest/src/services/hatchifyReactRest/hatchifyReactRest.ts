import { assembler } from "@hatchifyjs/hatchify-core"
import type {
  GetSchemaFromName,
  GetSchemaNames,
  Meta,
  PartialSchemas,
  RestClient,
} from "@hatchifyjs/rest-client"
import { subscribeToAll } from "@hatchifyjs/rest-client"
import type { Unsubscribe } from "@hatchifyjs/rest-client"
import type {
  QueryList,
  RecordType,
  RequestMetaData,
} from "@hatchifyjs/rest-client"
import { createStore, findAll } from "@hatchifyjs/rest-client"
import { useAll } from ".."

export type HatchifyReactRest<TSchemas extends PartialSchemas> = {
  [SchemaName in keyof TSchemas]: {
    // promises
    findAll: (
      query: QueryList,
    ) => Promise<
      [
        Array<RecordType<GetSchemaFromName<TSchemas, SchemaName>>>,
        RequestMetaData,
      ]
    >
    // hooks
    useAll: (
      query?: QueryList,
    ) => [Array<RecordType<GetSchemaFromName<TSchemas, SchemaName>>>, Meta]
    // subscribes
    subscribeToAll: (
      query: QueryList | undefined,
      callback: (
        records: Array<RecordType<GetSchemaFromName<TSchemas, SchemaName>>>,
      ) => void,
    ) => Unsubscribe
  }
}

export const hatchifyReactRest = <const TSchemas extends PartialSchemas>(
  partialSchemas: TSchemas,
  restClient: RestClient,
): HatchifyReactRest<TSchemas> => {
  const finalSchemas = assembler(partialSchemas)
  const storeKeys = Object.values(finalSchemas).map((schema) => schema.name)
  createStore(storeKeys)

  const functions = Object.entries(partialSchemas).reduce(
    (acc, [schemaName, schema]) => {
      const key = schemaName as keyof typeof acc
      acc[key] = {
        // promises
        findAll: (query) =>
          findAll<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            query || {},
          ),
        // hooks
        useAll: (query) =>
          useAll<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            query ?? {},
          ),
        // subscribes
        subscribeToAll: (query, callback) =>
          subscribeToAll<TSchemas, GetSchemaNames<TSchemas>>(
            schemaName,
            query,
            callback,
          ),
      }

      return acc
    },
    {} as HatchifyReactRest<TSchemas>,
  )

  return functions
}

// const partialTodo = {
//   name: "Todo",
//   attributes: {
//     age: integer(),
//     importance: integer(),
//   },
// }

// const partialUser = {
//   name: "User",
//   attributes: {
//     age: integer({ required: true }),
//     importance: {
//       control: { type: "String" } as any,
//     } as any,
//   },
// }

// const app = hatchifyReactRest(
//   { Todo: partialTodo, User: partialUser },
//   undefined as any,
// )

// async function test() {
//   const [a] = await app.Todo.findAll({})
//   const [b] = await app.User.findAll({})
//   a[0].id
//   a[0].age
//   a[0].importance
//   a[0].adsfaasdfaskldhfk
//   b[0].id
//   b[0].age
//   b[0].importance
//   // b[0].asdf

//   const [aa] = app.Todo.useAll({})
//   aa[0].id
//   aa[0].age
//   aa[0].importance
//   // aa[0].asdfas
// }
