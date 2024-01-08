import type { PartialSchema } from "@hatchifyjs/core"
import {
  assembler,
  // string,
  // integer,
  // datetime,
  // boolean,
  // belongsTo,
  // hasMany,
} from "@hatchifyjs/core"
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
        query: QueryList<GetSchemaFromName<TSchemas, SchemaName>>,
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
      ) => Promise<
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
      >
      updateOne: (
        data: Omit<
          FlatUpdateType<GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
      ) => Promise<
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
      >
      deleteOne: (id: string) => Promise<void>
      // hooks
      useAll: (
        query?: QueryList<GetSchemaFromName<TSchemas, SchemaName>>,
        baseFilter?: Filters,
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
      useCreateOne: () => [
        (
          data: Omit<
            FlatCreateType<GetSchemaFromName<TSchemas, SchemaName>>,
            "__schema"
          >,
        ) => void,
        Meta,
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>?,
      ]
      useUpdateOne: () => [
        (
          data: Omit<
            FlatUpdateType<GetSchemaFromName<TSchemas, SchemaName>>,
            "__schema"
          >,
        ) => void,
        Meta,
        (
          | RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
          | null
          | undefined
        ),
      ]
      useDeleteOne: () => [(id: string) => void, Meta]
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
  const storeKeys = Object.values(finalSchemas).map((schema) =>
    schema.namespace ? `${schema.namespace}_${schema.name}` : schema.name,
  )
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
        createOne: (data) =>
          createOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            data,
          ),
        updateOne: (data) =>
          updateOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            data,
          ),
        deleteOne: (id) =>
          deleteOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            id,
          ),
        // hooks
        useAll: (query, baseFilter) =>
          useAll<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            query ?? {},
            baseFilter,
          ),
        useOne: (query) =>
          useOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
            query,
          ),
        useCreateOne: () =>
          useCreateOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
          ),
        useUpdateOne: () =>
          useUpdateOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
          ),
        useDeleteOne: () =>
          useDeleteOne<TSchemas, TSchemaName>(
            restClient,
            finalSchemas,
            typedSchemaName,
          ),
      }

      return acc
    },
    {} as HatchifyReactRest<TSchemas>,
  )

  return functions
}

// todo: leaving for testing, remove before merge to main
// const partialTodo = {
//   name: "Todo",
//   attributes: {
//     title: string(),
//     reqTitle: string({ required: true }),
//     age: integer({ required: true }),
//     optAge: integer({ required: false }),
//     important: boolean({ required: true }),
//     optImportant: boolean(),
//     created: datetime({ required: true }),
//     optCreated: datetime(),
//   },
//   relationships: {
//     user: belongsTo("User"),
//     users: hasMany("User"),
//   },
// } satisfies PartialSchema

// partialTodo.relationships.user.targetSchema
// //                              ^?

// const partialUser = {
//   name: "User",
//   attributes: {
//     name: string({ required: true }),
//     age: integer({ required: true }),
//     employed: boolean(),
//   },
// } satisfies PartialSchema

// const schemas = {
//   Todo: partialTodo,
//   User: partialUser,
// }

// const app = hatchifyReactRest({
//   completeSchemaMap: schemas,
// } as RestClient<typeof schemas, any>)

// type Prettify<T> = {
//   [K in keyof T]: T[K]
// } & {}

// app.Todo.createOne({
//   attributes: { title: "hio", reqTitle: "", age: 0, important: false, created: "" },
// })

// app.Todo.findAll({
//   include: ["user", "users"]
// }).then(([records]) => {
//   records[0].user
// })

// app.Todo.findOne("id").then((record) => {
//   record?.user
// })
// app.User.findOne("id").then((record) => {
//   record?.name
//   record?.age
//   record?.shouldError
// })

// const [one] = app.Todo.useOne("id")
// one?.id
// one?.optAge
// one?.shouldError

// app.Todo.findAll({}).then(([records]) => {
//   records[0].id
//   records[0].optAge
//   records[0].shouldError
// })

// const [all] = app.Todo.useAll({})
// all[0].id
// all[0].optAge
// all[0].shouldError

// app.Todo.createOne({
//   attributes: {
//     reqTitle: "",
//     age: 13,
//     important: true,
//     created: new Date(),
//   },
//   relationships: {
//     user: {
//       id: "1234",
//     },
//     users: [{ id: "1234" }],
//   },
// })
// app.User.createOne({
//   attributes: {
//     name: "",
//     age: 13,
//     employed: true,
//     shouldError: "",
//   },
// })

// const [create] = app.Todo.useCreateOne()
// create({
//   attributes: {
//     reqTitle: "",
//     age: 13,
//     important: true,
//     created: new Date(),
//     shouldError: "",
//   },
// })

// app.Todo.updateOne({
//   id: "1234",
//   attributes: {
//     reqTitle: "",
//     age: 13,
//     important: true,
//     created: new Date(),
//     // shouldError: '',
//   },
// })

// const [update] = app.Todo.useUpdateOne()
// update({
//   id: "1234",
//   attributes: {
//     reqTitle: "",
//     age: 13,
//     important: true,
//     created: new Date(),
//     // user: {
//     //   id: "1234"
//     // }
//     // shouldError: '',
//   },
//   relationships: {
//     user: {
//       id: "123",
//     },
//     users: [{
//       id: "1234",
//       id: "3434"
//     }]
//   }
// })

// app.Todo.deleteOne("1234")
