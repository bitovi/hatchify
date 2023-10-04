import type { PartialSchema } from "@hatchifyjs/core"
import { assembler, string, integer, datetime } from "@hatchifyjs/core"
import type {
  CreateType,
  GetSchemaFromName,
  GetSchemaNames,
  PartialSchemas,
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
    findOne: (
      query: QueryOne | string,
    ) => Promise<
      RecordType<GetSchemaFromName<TSchemas, SchemaName>> | undefined
    >
    createOne: (
      data: Omit<
        CreateType<GetSchemaFromName<TSchemas, SchemaName>>,
        "__schema"
      >,
    ) => Promise<RecordType<GetSchemaFromName<TSchemas, SchemaName>>>
    updateOne: (
      data: Omit<
        UpdateType<GetSchemaFromName<TSchemas, SchemaName>>,
        "__schema"
      >,
    ) => Promise<RecordType<GetSchemaFromName<TSchemas, SchemaName>> | null>
    deleteOne: (id: string) => Promise<void>
    // hooks
    useAll: (
      query?: QueryList,
      baseFilter?: Filters,
    ) => [Array<RecordType<GetSchemaFromName<TSchemas, SchemaName>>>, Meta]
    useOne: (
      query: QueryOne | string,
    ) => [RecordType<GetSchemaFromName<TSchemas, SchemaName>> | undefined, Meta]
    useCreateOne: () => [
      (
        data: Omit<
          CreateType<GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
      ) => void,
      Meta,
      RecordType<GetSchemaFromName<TSchemas, SchemaName>>?,
    ]
    useUpdateOne: () => [
      (
        data: Omit<
          UpdateType<GetSchemaFromName<TSchemas, SchemaName>>,
          "__schema"
        >,
      ) => void,
      Meta,
      RecordType<GetSchemaFromName<TSchemas, SchemaName>> | null | undefined,
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
  // const TSchemas extends PartialSchemas, // <--- why the f doesn't this work
>(
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

// // todo: leaving for testing, remove before merge to main
const partialTodo = {
  name: "Todo",
  attributes: {
    // title: string(),
    // age: integer(),
    // importance: integer(),
    title: string({ required: true }),
    age: integer({ required: false }),
    importance: integer({ required: true }),
    created: datetime(),
  },
} satisfies PartialSchema

const app = hatchifyReactRest({ Todo: partialTodo }, undefined as any)

// app.Todo.createOne({
//   title: "asdf",
//   age: 5,
// })

app.Todo.createOne({
  title: "false",
  age: null,
  importance: null,
  created: new Date(),
})

app.Todo.updateOne({
  id: "1234",
  // title: "string",
  importance: 5,
})

// const [create] = app.Todo.useCreateOne()
// create({
//   title: "string",
//   age: 5,
//   importance: 5,
//   created: new Date(),
// })

// async function test() {
//   const [a] = await app.Todo.findAll({})
//   const [b] = await app.User.findAll({})
//   a[0].id
//   a[0].age
//   a[0].importance
//   a[0].created
//   a[0].adsfaasdfaskldhfk
//   b[0].id
//   b[0].age
//   b[0].importance
//   // b[0].asdf

//   const c = await app.Todo.createOne({
//     attributes: { title: "asdf", age: 5, importance: 5, created: "" },
//   })

//   c.id

//   const d = await app.Todo.updateOne({
//     id: "asdf",
//     attributes: { title: "asdf" },
//   })

//   d?.id
//   d?.age
//   d?.importance

//   const [aa] = app.Todo.useAll({})
//   aa[0].id
//   aa[0].age
//   aa[0].importance
//   // aa[0].asdfas

//   const [bb] = app.Todo.useOne("id")
//   bb.id
//   bb.age
//   bb.importance

//   const [create, meta, record] = app.Todo.useCreateOne()
//   create({ attributes: { title: "asdf", age: 5, importance: 5 } })
//   record?.
// }
