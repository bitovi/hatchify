# `@hatchifyjs/react-jsonapi`

`@hatchifyjs/react-jsonapi` is an [NPM package](https://www.npmjs.com/package/@hatchifyjs/react-jsonapi) that takes [Schemas](../schema/README.md) and produces an API layer that your frontend can use for a JSONAPI backend.

```ts
import { hatchifyReactRest, createJsonapiClient } from "@hatchifyjs/react-jsonapi"

// Define the schema
const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      dueDate: datetime(),
    },
  },
} satisfies Record<string, PartialSchema>

const hatchedReactRest = hatchifyReactRest(createJsonapiClient("/api", schemas))

// Use the promise-based API
hatchedReactRest.Todo.findAll({}).then(([records]) => {
  console.log(records)
})

hatchedReactRest.Todo.findOne("de596092-aa33-42e7-8bb7-09ec5b20d73f").then(([record]) => {
  console.log(record)
})

const createdRecord = await hatchedReactRest.Todo.createOne({
  name: "Learn HatchifyJS",
  dueDate: new Date(),
})

await hatchedReactRest.Todo.updateOne({
  id: createdRecord.id,
  name: "Master HatchifyJS",
})

await hatchedReactRest.Todo.deleteOne(createdRecord.id)

// todo: hook-based API
```

- [Exports](#exports)
- [`createJsonapiClient`](#createjsonapiclient)
- [`hatchifyReactRest`](#hatchifyreactrest)
  - [`hatchifyReactRest[SchemaName].findAll`](#hatchifyreactrestschemanamefindall)
  - [`hatchifyReactRest[SchemaName].findOne`](#hatchifyreactrestschemanamefindone)
  - [`hatchifyReactRest[SchemaName].createOne`](#hatchifyreactrestschemanamecreateone)
  - [`hatchifyReactRest[SchemaName].updateOne`](#hatchifyreactrestschemanameupdateone)
  - [`hatchifyReactRest[SchemaName].deleteOne`](#hatchifyreactrestschemanamedeleteone)
  - [`hatchifyReactRest[SchemaName].useAll`](#hatchifyreactrestschemanameuseall)
  - [`hatchifyReactRest[SchemaName].useOne`](#hatchifyreactrestschemanameuseone)
  - [`hatchifyReactRest[SchemaName].useCreateOne`](#hatchifyreactrestschemanameusecreateone)
  - [`hatchifyReactRest[SchemaName].useUpdateOne`](#hatchifyreactrestschemanameuseupdateone)
  - [`hatchifyReactRest[SchemaName].useDeleteOne`](#hatchifyreactrestschemanameusedeleteone)

## Exports

`@hatchifyjs/react-jsonapi` exports the following:

- `hatchifyReactRest` - A function that takes a `RestClient` and returns an object with promise and hook-based functions for each schema.
- `createJsonapiClient` - A function that takes a base URL and a set of schemas and returns a `RestClient` object for a JSONAPI backend.

```ts
import { hatchifyReactRest, createJsonapiClient } from "@hatchifyjs/react-jsonapi"
```

## `createJsonapiClient`

`createJsonapiClient(baseUrl: string, schemas: Schemas): RestClient` is a function that takes a base URL and a set of schemas and returns a `RestClient` object for a JSONAPI backend.

```ts
const jsonapiClient = createJsonapiClient("/api", schemas)
```

## `hatchifyReactRest`

`hatchifyReactRest(restClient: RestClient): HatchifyReactRest` is a function that takes a `RestClient` and returns an object with promise and hook-based functions for each schema.

```ts
const hatchedReactRest = hatchifyReactRest(jsonapiClient)
```

### `hatchifyReactRest[SchemaName].findAll`

`hatchedReactRest[SchemaName].findAll(): Promise<[Record[], MetaData]>` is a function that returns a promise that resolves to an array of records of the given schema and any metadata returned by the server.

```ts
const result = await hatchedReactRest.Todo.findAll({})
```

**Parameters**

An object with the following properties:

⚠️ TODO: move to QueryList type! ⚠️

| Property | Type                                                 | Default     | Details                                   |
| -------- | ---------------------------------------------------- | ----------- | ----------------------------------------- |
| include  | `string[]?`                                          | `undefined` | Specify which relationships to include.   |
| fields   | `string[]?`                                          | `undefined` | Specify which fields to return.           |
| filter   | `{ field: string, operator: string, value: any }[]?` | `undefined` | Specify which records to include.         |
| sort     | `string?`                                            | `undefined` | Specify how to sort the records.          |
| page     | `{ page: number, size: number }?`                    | `undefined` | Specify which page of records to include. |

**Returns**

An array with the following properties:

| Property    | Type       | Details                                                                       |
| ----------- | ---------- | ----------------------------------------------------------------------------- |
| `result[0]` | `Record[]` | An array of records of the given schema.                                      |
| `result[1]` | `MetaData` | An object with metadata returned by the server, such as the count of records. |

### `hatchifyReactRest[SchemaName].findOne`

`hatchedReactRest[SchemaName].findOne(id: string): Promise<Record>` is a function that returns a promise that resolves to a single record of the given schema for the id.

```ts
const record = await hatchedReactRest.Todo.findOne("de596092-aa33-42e7-8bb7-09ec5b20d73f")
```

```ts
const record = await hatchedReactRest.Todo.findOne({
  id: "de596092-aa33-42e7-8bb7-09ec5b20d73f",
  fields: ["name"],
})
```

**Parameters**

| Property  | Type                      | Details                                                 |
| --------- | ------------------------- | ------------------------------------------------------- |
| IdOrQuery | `string`                  | The id of the record.                                   |
|           | <a href="">`QueryOne`</a> | The id of the record and an optional include or fields. |

### `hatchifyReactRest[SchemaName].createOne`

`hatchedReactRest[SchemaName].createOne(data: Partial<Record>): Promise<Record>` is a function that returns a promise that resolves to the newly created record.

```ts
const createdRecord = await hatchedReactRest.Todo.createOne({
  name: "Learn HatchifyJS",
  dueDate: new Date(),
})
```

**Parameters**

| Property | Type                  | Details                                           |
| -------- | --------------------- | ------------------------------------------------- |
| data     | `Partial<RecordType>` | An object containing the data for the new record. |

**Returns**

The newly created record.

### `hatchifyReactRest[SchemaName].updateOne`

`hatchedReactRest[SchemaName].updateOne(data: Partial<Record>): Promise<Record>` is a function that returns a promise that resolves to the updated record.

```ts
const updated = await hatchedReact.model.Todo.updateOne({
  id: createdRecord.id,
  name: "Master HatchifyJS",
})
```

**Parameters**

| Property | Type                  | Details                                                                                               |
| -------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| data     | `Partial<RecordType>` | An object containing the data for the updated record. The id is required to be passed into RecordType |

**Returns**

The updated record.

### `hatchifyReactRest[SchemaName].deleteOne`

`hatchedReactRest[SchemaName].deleteOne(id: string): Promise<void>` is a function that returns a promise that resolves when the record is deleted.

```ts
await hatchedReactRest.Todo.deleteOne("de596092-aa33-42e7-8bb7-09ec5b20d73f")
```

**Parameters**

| Property | Type     | Details                         |
| -------- | -------- | ------------------------------- |
| id       | `string` | The id of the record to delete. |

**Returns**

A promise that resolves when the record is deleted.

### `hatchifyReactRest[SchemaName].useAll`

`hatchedReactRest[SchemaName].useAll(): [Record[], RequestState]` is a hook that returns an array of records and request state data of the given schema.

```ts
const result = hatchedReactRest.Todo.useAll()
```

**Parameters**

TODO: QueryList, baseFilter, minimumLoadTime

**Returns**

An array with the following properties:

| Property    | Type           | Details                                  |
| ----------- | -------------- | ---------------------------------------- |
| `result[0]` | `Record[]`     | An array of records of the given schema. |
| `result[1]` | `RequestState` | An object with request state data.       |

### `hatchifyReactRest[SchemaName].useOne`

`hatchedReactRest[SchemaName].useOne(id: string): [Record, RequestState]` is a hook that returns a single record and request state data of the given schema and id.

```ts
const [record, requestState] = hatchedReactRest.Todo.useOne("de596092-aa33-42e7-8bb7-09ec5b20d73f")
```

### `hatchifyReactRest[SchemaName].useCreateOne`

`hatchedReactRest[SchemaName].useCreateOne(): [(data: Partial<Record>) => Promise<void>, RequestState, Record?]` is a hook that returns a function to create a record, request state data, and the most recently created record.

```ts
const [createRecord, requestState, createdRecord] = hatchedReactRest.Todo.useCreateOne()
```

### `hatchifyReactRest[SchemaName].useUpdateOne`

`hatchedReactRest[SchemaName].useUpdateOne(): [(data: Partial<Record>) => Promise<void>, { id: RequestState }, Record?]` is a hook that returns a function to update a record, request state data keyed by the id of the updated record, and the most recently updated record.

```ts
const [updateRecord, requestState, updatedRecord] = hatchedReactRest.Todo.useUpdateOne()
```

### `hatchifyReactRest[SchemaName].useDeleteOne`

`hatchedReactRest[SchemaName].useDeleteOne(): [(id: string) => Promise<void>, { id: RequestState }]` is a hook that returns a function to delete a record and request state data keyed by the id of the deleted record.

```ts
const [deleteRecord, requestState] = hatchedReactRest.Todo.useDeleteOne()
```
