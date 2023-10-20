import type { PartialSchema } from "@hatchifyjs/core"
import {
  assembler,
  string,
  integer,
  datetime,
  boolean,
  belongsTo,
  hasMany,
} from "@hatchifyjs/core"
import type {
  CreateType,
  GetSchemaFromName,
  GetSchemaNames,
  RecordType,
  RestClient,
  UpdateType,
  Filters,
  Meta,
  QueryList,
  QueryOne,
  RequestMetaData,
} from "@hatchifyjs/rest-client"
import {
  createStore,
  createOne,
  deleteOne,
  updateOne,
  findAll,
  findOne,
} from "@hatchifyjs/rest-client"
import { useAll, useCreateOne, useOne, useUpdateOne, useDeleteOne } from ".."

export type HatchifyReactRest<TSchemas extends Record<string, PartialSchema>> =
  {
    [SchemaName in keyof TSchemas]: {
      // promises
      findAll: (
        query: QueryList,
      ) => Promise<
        [
          Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>>,
          RequestMetaData,
        ]
      >
      findOne: (
        query: QueryOne | string,
      ) => Promise<
        | RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
        | undefined
      >
      createOne: (
        data: Omit<
          CreateType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
      ) => Promise<
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>
      >
      updateOne: (
        data: Omit<
          UpdateType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
      ) => Promise<RecordType<
        TSchemas,
        GetSchemaFromName<TSchemas, SchemaName>
      > | null>
      deleteOne: (id: string) => Promise<void>
      // hooks
      useAll: (
        query?: QueryList,
        baseFilter?: Filters,
      ) => [
        Array<RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>>,
        Meta,
      ]
      useOne: (
        query: QueryOne | string,
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
            CreateType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>,
            "__schema"
          >,
        ) => void,
        Meta,
        RecordType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>?,
      ]
      useUpdateOne: () => [
        (
          data: Omit<
            UpdateType<TSchemas, GetSchemaFromName<TSchemas, SchemaName>>,
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
>(
  // partialSchemas: TSchemas,
  restClient: RestClient<TSchemas>,
): HatchifyReactRest<TSchemas> => {
  const { completeSchemaMap: partialSchemas } = restClient
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
        findOne: (query) =>
          findOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            query,
          ),
        createOne: (data) =>
          createOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            data,
          ),
        updateOne: (data) =>
          updateOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            data,
          ),
        deleteOne: (id) =>
          deleteOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            id,
          ),
        // hooks
        useAll: (query, baseFilter) =>
          useAll<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            query ?? {},
            baseFilter,
          ),
        useOne: (query) =>
          useOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
            query,
          ),
        useCreateOne: () =>
          useCreateOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
          ),
        useUpdateOne: () =>
          useUpdateOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
          ),
        useDeleteOne: () =>
          useDeleteOne<TSchemas, GetSchemaNames<TSchemas>>(
            restClient,
            finalSchemas,
            schemaName,
          ),
      }

      return acc
    },
    {} as HatchifyReactRest<TSchemas>,
  )

  return functions
}

// todo: leaving for testing, remove before merge to main
const partialTodo = {
  name: "Todo",
  attributes: {
    title: string(),
    reqTitle: string({ required: true }),
    age: integer({ required: true }),
    optAge: integer({ required: false }),
    important: boolean({ required: true }),
    optImportant: boolean(),
    created: datetime({ required: true }),
    optCreated: datetime(),
  },
  relationships: {
    user: belongsTo("User"),
    users: hasMany("User"),
  },
} satisfies PartialSchema

partialTodo.relationships.user.targetSchema
//                              ^?

const partialUser = {
  name: "User",
  attributes: {
    name: string({ required: true }),
    age: integer({ required: true }),
    employed: boolean(),
  },
} satisfies PartialSchema

const schemas = {
  Todo: partialTodo,
  User: partialUser,
}

const app = hatchifyReactRest({
  completeSchemaMap: schemas,
} as RestClient<typeof schemas>)

// type Prettify<T> = {
//   [K in keyof T]: T[K]
// } & {}

// app.Todo.findAll({}).then(([records]) => {
//   records[0].user.
// })

// app.Todo.findOne("id").then((record) => {
//   record?.user.
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

app.Todo.createOne({
  attributes: {
    reqTitle: "",
    age: 13,
    important: true,
    created: new Date(),
  },
  relationships: {
    user: {
      id: "1234",
    },
    users: [{ id: "1234" }],
  },
})
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
//     user: {
//       id: "1234",
//       attributes: {
//         name: "",
//         age: 13,
//         employed: true,
//         shouldError: "",
//       },
//     }
//     // shouldError: '',
//   },
// })

// app.Todo.deleteOne("1234")
