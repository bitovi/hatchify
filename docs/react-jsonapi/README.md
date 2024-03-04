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
- [createJsonapiClient](#createjsonapiclient)
- [hatchifyReactRest](#hatchifyreactrest)
  - [findAll](#findall)
  - [findOne](#findone)
  - [createOne](#createone)
  - [updateOne](#updateone)
  - [deleteOne](#deleteone)
  - [useAll](#useall)
  - [useOne](#useone)
  - [useCreateOne](#usecreateone)
  - [useUpdateOne](#useupdateone)
  - [useDeleteOne](#usedeleteone)
- [Types](#types)
  - [QueryList](#querylist)
  - [QueryOne](#queryone)
  - [RecordType](#recordtype)

## Exports

`@hatchifyjs/react-jsonapi` exports the following:

- `hatchifyReactRest` - A function that takes a `RestClient` and returns an object with promise and hook-based functions for each schema.
- `createJsonapiClient` - A function that takes a base URL and a set of schemas and returns a `RestClient` object for a JSONAPI backend.

```ts
import { hatchifyReactRest, createJsonapiClient } from "@hatchifyjs/react-jsonapi"
```

## createJsonapiClient

`createJsonapiClient(baseUrl: string, schemas: Schemas): RestClient` is a function that takes a base URL and a set of schemas and returns a `RestClient` object for a JSONAPI backend.

```ts
const jsonapiClient = createJsonapiClient("/api", schemas)
```

## hatchifyReactRest

`hatchifyReactRest(restClient: RestClient): HatchifyReactRest` is a function that takes a `RestClient` and returns an object with promise and hook-based functions for each schema.

```ts
const hatchedReactRest = hatchifyReactRest(jsonapiClient)
```

### findAll

`hatchedReactRest[SchemaName].findAll(): Promise<[RecordType[], MetaData]>` is a function that returns a promise that resolves to an array of records of the given schema and any metadata returned by the server.

```ts
const result = await hatchedReactRest.Todo.findAll({})
```

**Parameters**

| Property | Type                                 | Details                                                          |
| -------- | ------------------------------------ | ---------------------------------------------------------------- |
| query    | <a href="#querylist">`QueryList`</a> | An object with optional include, fields, filter, sort, and page. |

**Returns**

An array with the following properties:

| Property    | Type                                     | Details                                                                       |
| ----------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| `result[0]` | <a href="#recordtype">`RecordType[]`</a> | An array of records of the given schema.                                      |
| `result[1]` | `MetaData`                               | An object with metadata returned by the server, such as the count of records. |

### `hatchifyReactRest[SchemaName].findOne`

`hatchedReactRest[SchemaName].findOne(id: string): Promise<RecordType>` is a function that returns a promise that resolves to a single record of the given schema for the id.

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

| Property  | Type                               | Details                                                 |
| --------- | ---------------------------------- | ------------------------------------------------------- |
| IdOrQuery | `string`                           | The id of the record.                                   |
|           | <a href="#queryone">`QueryOne`</a> | The id of the record and an optional include or fields. |

### createOne

`hatchedReactRest[SchemaName].createOne(data: Partial<RecordType>): Promise<RecordType>` is a function that returns a promise that resolves to the newly created record.

```ts
const createdRecord = await hatchedReactRest.Todo.createOne({
  name: "Learn HatchifyJS",
  dueDate: new Date(),
})
```

**Parameters**

| Property | Type                                            | Details                                           |
| -------- | ----------------------------------------------- | ------------------------------------------------- |
| data     | <a href="#recordtype">`Partial<RecordType>`</a> | An object containing the data for the new record. |

**Returns**

The newly created record.

### updateOne

`hatchedReactRest[SchemaName].updateOne(data: Partial<RecordType>): Promise<RecordType>` is a function that returns a promise that resolves to the updated record.

```ts
const updated = await hatchedReact.model.Todo.updateOne({
  id: createdRecord.id,
  name: "Master HatchifyJS",
})
```

**Parameters**

| Property | Type                                            | Details                                                                                               |
| -------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| data     | <a href="#recordtype">`Partial<RecordType>`</a> | An object containing the data for the updated record. The id is required to be passed into RecordType |

**Returns**

The updated record.

### deleteOne

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

### useAll

`hatchedReactRest[SchemaName].useAll(): [RecordType[], RequestState]` is a hook that returns an array of records and request state data of the given schema.

```ts
const result = hatchedReactRest.Todo.useAll()
```

**Parameters**

TODO: QueryList, baseFilter, minimumLoadTime

**Returns**

An array with the following properties:

| Property    | Type                                     | Details                                  |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| `result[0]` | <a href="#recordtype">`RecordType[]`</a> | An array of records of the given schema. |
| `result[1]` | `RequestState`                           | An object with request state data.       |

### useOne

`hatchedReactRest[SchemaName].useOne(id: string): [RecordType, RequestState]` is a hook that returns a single record and request state data of the given schema and id.

```ts
const [record, requestState] = hatchedReactRest.Todo.useOne("de596092-aa33-42e7-8bb7-09ec5b20d73f")
```

### useCreateOne

`hatchedReactRest[SchemaName].useCreateOne(): [(data: Partial<RecordType>) => Promise<void>, RequestState, RecordType?]` is a hook that returns a function to create a record, request state data, and the most recently created record.

```ts
const [createRecord, requestState, createdRecord] = hatchedReactRest.Todo.useCreateOne()
```

### useUpdateOne

`hatchedReactRest[SchemaName].useUpdateOne(): [(data: Partial<RecordType>) => Promise<void>, { id: RequestState }, RecordType?]` is a hook that returns a function to update a record, request state data keyed by the id of the updated record, and the most recently updated record.

```ts
const [updateRecord, requestState, updatedRecord] = hatchedReactRest.Todo.useUpdateOne()
```

### useDeleteOne

`hatchedReactRest[SchemaName].useDeleteOne(): [(id: string) => Promise<void>, { id: RequestState }]` is a hook that returns a function to delete a record and request state data keyed by the id of the deleted record.

```ts
const [deleteRecord, requestState] = hatchedReactRest.Todo.useDeleteOne()
```

## Types

### QueryList

`QueryList` is an object with the following properties:

| Property | Type                                                 | Default     | Details                                   |
| -------- | ---------------------------------------------------- | ----------- | ----------------------------------------- |
| include  | `string[]?`                                          | `undefined` | Specify which relationships to include.   |
| fields   | `string[]?`                                          | `undefined` | Specify which fields to return.           |
| filter   | `{ field: string, operator: string, value: any }[]?` | `undefined` | Specify which records to include.         |
| sort     | `string?`                                            | `undefined` | Specify how to sort the records.          |
| page     | `{ page: number, size: number }?`                    | `undefined` | Specify which page of records to include. |

### QueryOne

`QueryOne` is an object with the following properties:

| Property | Type        | Details                                 |
| -------- | ----------- | --------------------------------------- |
| id       | `string`    | The id of the record.                   |
| include  | `string[]?` | Specify which relationships to include. |
| fields   | `string[]?` | Specify which fields to return.         |

### RecordType

`RecordType` is a flat object representing the fields (id, attributes, and relationships) of a schema.

| Property | Type     | Details                                         |
| -------- | -------- | ----------------------------------------------- |
| id       | `string` | The id of the record.                           |
| ...      | `any`    | The attributes and relationships of the record. |
