# `@hatchifyjs/react-jsonapi`

`@hatchifyjs/react-jsonapi` is an [NPM package](https://www.npmjs.com/package/@hatchifyjs/react-jsonapi) that takes [Schemas](../schema/README.md) and produces an API layer that your frontend can use for a JSON:API backend.

<pre>
import { hatchifyReactRest, createJsonapiClient } from "@hatchifyjs/react-jsonapi"
import { boolean, belongsTo, hasMany, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      complete: boolean(),
    },
    relationships: {
      user: belongsTo("User"),
    },
  },
  User: {
    name: "User",
    attributes: {
      email: string(),
    },
    relationships: {
      todos: hasMany("Todo"),
    },
  },
} satisfies Record<\string, PartialSchema>

const hatchedReactRest = <a href="#hatchifyreactrest">hatchifyReactRest</a>(<a href="#createjsonapiclient">createJsonapiClient</a>("/api", schemas))

// Use the promise-based API
const [records, requestMeta] = await hatchedReactRest.Todo.<a href="#findall">findAll</a>()
const record =                 await hatchedReactRest.Todo.<a href="#findone">findOne</a>(UUID)
const created =                await hatchedReactRest.Todo.<a href="#createone">createOne</a>({
  name: "Learn HatchifyJS",
  complete: false,
})
const updated =                await hatchedReactRest.Todo.<a href="#updateone">updateOne</a>({
  id: createdRecord.id,
})
                               await hatchedReactRest.Todo.<a href="#deleteone">deleteOne</a>(createdRecord.id)

// Use the hook-based API
function MyHatchifyCompnent() {
  const [records, allState] =                hatchedReactRest.Todo.<a href="#useall">useAll</a>()
  const [record, oneState] =                 hatchedReactRest.Todo.<a href="#useone">useOne</a>(UUID)
  const [createTodo, createState, created] = hatchedReactRest.Todo.<a href="#usecreateone">useCreateOne</a>()
  const [updateTodo, updateState, updated] = hatchedReactRest.Todo.<a href="#useupdateone">useUpdateOne</a>()
  const [deleteTodo, deleteState] =          hatchedReactRest.Todo.<a href="#usedeleteone">useDeleteOne</a>()
}
</pre>

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
  - [CreateFunction](#createfunction)
  - [DeleteFunction](#deletefunction)
  - [MetaData](#metadata)
  - [QueryList](#querylist)
  - [QueryOne](#queryone)
  - [RecordType](#recordtype)
  - [RequestState](#requeststate)
  - [UpdateFunction](#updatefunction)

## Exports

`@hatchifyjs/react-jsonapi` exports the following:

- <a href="#hatchifyreactrest">`hatchifyReactRest`</a> - A function that takes a `RestClient` and returns an object with promise and hook-based functions for each schema.
- <a href="#createjsonapiclient">`createJsonapiClient`</a> - A function that takes a base URL and a set of schemas and returns a `RestClient` object for a JSON:API backend.

```ts
import { hatchifyReactRest, createJsonapiClient } from "@hatchifyjs/react-jsonapi"
```

## createJsonapiClient

`createJsonapiClient(baseUrl: string, schemas: Schemas): RestClient` creates a `RestClient` which can then be passed into `hatchifyReactRest`. A `RestClient` is made up of a set of functions that can be used to interact with a JSON:API backend.

```ts
const jsonapiClient = createJsonapiClient("/api", schemas)
```

## hatchifyReactRest

`hatchifyReactRest(restClient: RestClient): HatchifyReactRest` is the entry point function. It returns an instance of `HatchifyReactRest`, which is an object keyed by each schema that was passed into the `createJsonapiClient` function. Each schema has a set of promise and hook-based functions for interacting with a JSON:API backend.

```ts
const hatchedReactRest = hatchifyReactRest(jsonapiClient)

const [todos] = await hatchedReactRest.Todo.useAll()
const [users] = await hatchedReactRest.User.useAll()
```

### findAll

`hatchedReactRest[SchemaName].findAll(): Promise<[RecordType[], MetaData]>`

```ts
const [todos, metadata] = await hatchedReactRest.Todo.findAll()
```

**Parameters**

| Property  | Type                                  | Details                                                          |
| --------- | ------------------------------------- | ---------------------------------------------------------------- |
| queryList | <a href="#querylist">`QueryList?`</a> | An object with optional include, fields, filter, sort, and page. |

**Returns**

An array with the following properties:

| Property | Common Alias                                | Type                                     | Details                                                                       |
| -------- | ------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------- |
| `[0]`    | the plural name of the schema, e.g. `todos` | <a href="#recordtype">`RecordType[]`</a> | An array of records of the given schema.                                      |
| `[1]`    | `metadata`                                  | <a href="#metadata">`MetaData`</a>       | An object with metadata returned by the server, such as the count of records. |

### findOne

`hatchedReactRest[SchemaName].findOne(id: string): Promise<RecordType>`

```ts
const record = await hatchedReactRest.Todo.findOne(UUID)
```

```ts
const record = await hatchedReactRest.Todo.findOne({
  id: UUID,
  fields: ["name"],
})
```

**Parameters**

| Property     | Type                                | Details                                                 |
| ------------ | ----------------------------------- | ------------------------------------------------------- |
| IdOrQueryOne | `string`                            | The id of the record.                                   |
|              | <a href="#queryone ">`QueryOne`</a> | The id of the record and an optional include or fields. |

**Returns**

| Type                                            | Details                         |
| ----------------------------------------------- | ------------------------------- |
| <a href="#recordtype">`Promise<RecordType>`</a> | The record of the given schema. |

### createOne

`hatchedReactRest[SchemaName].createOne(data: Partial<RecordType>): Promise<RecordType`

```ts
const createdRecord = await hatchedReactRest.Todo.createOne({
  name: "Learn HatchifyJS",
  complete: false,
})
```

**Parameters**

| Property | Type                                            | Details                                           |
| -------- | ----------------------------------------------- | ------------------------------------------------- |
| data     | <a href="#recordtype">`Partial<RecordType>`</a> | An object containing the data for the new record. |

**Returns**

| Type                                            | Details                   |
| ----------------------------------------------- | ------------------------- |
| <a href="#recordtype">`Promise<RecordType>`</a> | The newly created record. |

### updateOne

`hatchedReactRest[SchemaName].updateOne(data: Partial<RecordType>): Promise<RecordType>`

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

| Type                                            | Details             |
| ----------------------------------------------- | ------------------- |
| <a href="#recordtype">`Promise<RecordType>`</a> | The updated record. |

### deleteOne

`hatchedReactRest[SchemaName].deleteOne(id: string): Promise<void>`

```ts
await hatchedReactRest.Todo.deleteOne(UUID)
```

**Parameters**

| Property | Type     | Details                         |
| -------- | -------- | ------------------------------- |
| id       | `string` | The id of the record to delete. |

**Returns**

| Type            | Details                                             |
| --------------- | --------------------------------------------------- |
| `Promise<void>` | A promise that resolves when the record is deleted. |

### useAll

`hatchedReactRest[SchemaName].useAll(): [RecordType[], RequestState]`

In this example, we use the `useAll` hook to fetch all todos and display them in a list. The hook returns an array with the todos that we map over and display. We use the the `RequestState` to determine whether to display a loading spinner or an error message.

```tsx
function TodosList() {
  const [todos, state] = hatchedReactRest.Todo.useAll()

  if (state.isPending) {
    return <div>Loading...</div>
  }

  if (state.isRejected) {
    return <div>Error: {state.error.message}</div>
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  )
}
```

**Parameters**

| Property        | Type                                                 | Details                                                                                                  |
| --------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| queryList       | <a href="#querylist">`QueryList?`</a>                | An object with optional include, fields, filter, sort, and page.                                         |
| baseFilter      | `{ field: string, operator: string, value: any }[]?` | An optional filter object made up of the field to filter, the operator type, and the value to filter by. |
| minimumLoadTime | `number?`                                            | The minimum time to show a loading spinner.                                                              |

**Returns**

An array with the following properties:

| Property | Common Alias                                | Type                                       | Details                                  |
| -------- | ------------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| `[0]`    | the plural name of the schema, e.g. `todos` | <a href="#recordtype">`RecordType[]`</a>   | An array of records of the given schema. |
| `[1]`    | `state`                                     | <a href="#requeststate">`RequestState`</a> | An object with request state data.       |

### useOne

`hatchedReactRest[SchemaName].useOne(id: string): [RecordType, RequestState]`

Here we use the `useOne` hook to fetch a single todo and display its name and whether it is complete. Using the `RequestState` object, we conditionally handle loading and error states. If the record is not found, we display a message to the user.

```tsx
function ViewTodo({ uuid }: { uuid: string }) {
  const [todo, state] = hatchedReactRest.Todo.useOne(uuid)

  if (state.isPending) {
    return <div>Loading...</div>
  }

  if (state.isRejected) {
    return <div>Error: {state.error.message}</div>
  }

  if (!todo) {
    return <div>Not found</div>
  }

  return (
    <div>
      <p>Name: {todo.name}</p>
      <p>Complete: {todo.complete ? "Yes" : "No"}</p>
    </div>
  )
}
```

**Parameters**

| Property     | Type                                | Details                                                 |
| ------------ | ----------------------------------- | ------------------------------------------------------- |
| IdOrQueryOne | `string`                            | The id of the record.                                   |
|              | <a href="#queryone ">`QueryOne`</a> | The id of the record and an optional include or fields. |

**Returns**

An array with the following properties:

| Property | Common Alias                                | Type                                       | Details                            |
| -------- | ------------------------------------------- | ------------------------------------------ | ---------------------------------- |
| `[0]`    | the plural name of the schema, e.g. `todos` | <a href="#recordtype">`RecordType`</a>     | The record of the given schema.    |
| `[1]`    | `state`                                     | <a href="#requeststate">`RequestState`</a> | An object with request state data. |

### useCreateOne

`hatchedReactRest[SchemaName].useCreateOne(): [CreateFunction, RequestState, RecordType?]`

Here we use the `useCreateOne` hook to create a simple form for creating a new todo. We us the `createTodo` function when the form is submitted, the `RequestState` object to conditionally handle loading and error states, and we track the `created` object to console log the newly created record.

```tsx
function CreateTodo() {
  const [createTodo, state, created] = hatchedReactRest.Todo.useCreateOne()
  const [name, setName] = useState("")

  useEffect(() => {
    console.log("created record:", created)
  }, [created])

  if (state.isPending) {
    return <div>Creating...</div>
  }

  if (state.isRejected) {
    return <div>Error: {state.error.message}</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        createTodo({ name })
        setName("")
      }}
    >
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Create</button>
    </form>
  )
}
```

**Returns**

An array with the following properties:

| Property | Common Alias         | Type                                           | Details                            |
| -------- | -------------------- | ---------------------------------------------- | ---------------------------------- |
| `[0]`    | `create{SchemaName}` | <a href="#createfunction">`CreateFunction`</a> | A function to create a record.     |
| `[1]`    | `state`              | <a href="#requeststate">`RequestState`</a>     | An object with request state data. |
| `[2]`    | `created`            | <a href="#recordtype">`RecordType`</a>         | The most recently created record.  |

### useUpdateOne

`hatchedReactRest[SchemaName].useUpdateOne(): [UpdateFunction, { id: RequestState }, RecordType?]`

Here we use the `useUpdateOne` hook to create a simple edit form for updating a todo. We use the `updateTodo` function when the form is submitted, the `RequestState` object to conditionally handle loading and error states, and we track the `updated` object to console log the newly updated record.

```tsx
function EditTodo({ todo }: { todo: { id: string; name: string } }) {
  const [updateTodo, state, updated] = hatchedReactRest.Todo.useUpdateOne()
  const [name, setName] = useState(todo.name)

  useEffect(() => {
    console.log("updated record:", updated)
  }, [updated])

  if (state[todo.id]?.isPending) {
    return <div>Updating...</div>
  }

  if (state[todo.id]?.isRejected) {
    return <div>Error: {state[todo.id]?.error.message}</div>
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        updateTodo({ id: todo.id, name })
      }}
    >
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Update</button>
    </form>
  )
}
```

**Returns**

An array with the following properties:

| Property | Common Alias         | Type                                           | Details                            |
| -------- | -------------------- | ---------------------------------------------- | ---------------------------------- |
| `[0]`    | `update{SchemaName}` | <a href="#updatefunction">`UpdateFunction`</a> | A function to update a record.     |
| `[1]`    | `state`              | <a href="#requeststate">`RequestState`</a>     | An object with request state data. |
| `[2]`    | `updated`            | <a href="#recordtype">`RecordType`</a>         | The most recently updated record.  |

### useDeleteOne

`hatchedReactRest[SchemaName].useDeleteOne(): [DeleteFunction, { id: RequestState }]`

Here we use the `useDeleteOne` hook to create alongside a list of todos. We use the `deleteTodo` function when the delete button is clicked, and the `RequestState` object to disable the delete button when the request is pending.

```tsx
function TodosListWithDelete() {
  const [deleteTodo, state] = hatchedReactRest.Todo.useDeleteOne()
  const [todos, todosState] = hatchedReactRest.Todo.useAll()

  if (todosState.isPending) {
    return <div>Loading...</div>
  }

  if (todosState.isRejected) {
    return <div>Error: {todosState.error.message}</div>
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          {todo.name}
          <button disabled={state[todo.id]?.isPending} onClick={() => deleteTodo(todo.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  )
}
```

**Returns**

An array with the following properties:

| Property | Common Alias         | Type                                           | Details                            |
| -------- | -------------------- | ---------------------------------------------- | ---------------------------------- |
| `[0]`    | `delete{SchemaName}` | <a href="#deletefunction">`DeleteFunction`</a> | A function to delete a record.     |
| `[1]`    | `state`              | <a href="#requeststate">`RequestState`</a>     | An object with request state data. |

## Types

### CreateFunction

`CreateFunction` is a function that takes an object containing the data for the new record and returns a promise that resolves to the newly created record.

| Type                                        | Details                                                                                                                                                                                         |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(data: RecordType) => Promise<RecordType>` | A function that creates a record, modifies the associated <a href="#requeststate">RequestState</a>, and updates the latest created record in the <a href="#usecreateone">useCreateOne</a> hook. |

### DeleteFunction

`DeleteFunction` is a function that takes the id of the record to delete and returns a promise that resolves when the record is deleted.

| Type                            | Details                                                                                                                                                     |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(id: string) => Promise<void>` | A function that deletes a record and modifies the associated <a href="#requeststate">RequestState</a> in the <a href="#usedeleteone">useDeleteOne</a> hook. |

### MetaData

`MetaData` is an object with metadata returned by the server, such as the count of records.

| Property | Type  | Details                                  |
| -------- | ----- | ---------------------------------------- |
| ...      | `any` | Metadata, for example `unpaginatedCount` |

### QueryList

`QueryList` is an object with the following properties:

| Property | Type                                                 | Details                                   |
| -------- | ---------------------------------------------------- | ----------------------------------------- |
| include  | `string[]?`                                          | Specify which relationships to include.   |
| fields   | `string[]?`                                          | Specify which fields to return.           |
| filter   | `{ field: string, operator: string, value: any }[]?` | Specify which records to include.         |
| sort     | `string?`                                            | Specify how to sort the records.          |
| page     | `{ page: number, size: number }?`                    | Specify which page of records to include. |

### QueryOne

`QueryOne` is an object with the following properties:

| Property | Type        | Details                                 |
| -------- | ----------- | --------------------------------------- |
| id       | `string`    | The id of the record.                   |
| include  | `string[]?` | Specify which relationships to include. |
| fields   | `string[]?` | Specify which fields to return.         |

### RecordType

`RecordType` is a flat object representing the JSON:API response from the backend. The attributes and relationships are flattened to the top level of the object.

| Property | Type     | Details                                         |
| -------- | -------- | ----------------------------------------------- |
| id       | `string` | The id of the record.                           |
| ...      | `any`    | The attributes and relationships of the record. |

The expected shape of the `RecordType` in the case of the `Todo` and `User` schemas would be:

```ts
{
  id: string,
  name: string,
  complete: boolean,
  user: {
    id: string,
    email: string,
  },
}

### RequestState

`RequestState` is an object with the following properties:

| Property   | Type                               | Details                                                         |
| ---------- | ---------------------------------- | --------------------------------------------------------------- |
| error      | `Error?`                           | An error object if the request failed.                          |
| isPending  | `boolean`                          | True if the status is `"loading"`, false otherwise.             |
| isRejected | `boolean`                          | True if the status is `"error"`, false otherwise.               |
| isResolved | `boolean`                          | True if the status is `"success"` or `"error`, false otherwise. |
| isSuccess  | `boolean`                          | True if status is `"success"`, false otherwise.                 |
| meta       | <a href="#metadata">`MetaData`</a> | Metadata returned by the server.                                |
|            |                                    |
| status     | `"loading"`                        | If the promise is pending.                                      |
|            | `"error"`                          | If the promise is rejected.                                     |
|            | `"success"`                        | If the promise is successfully resolved.                        |

### UpdateFunction

`UpdateFunction` is a function that takes an object containing the data for the new record and returns a promise that resolves to the newly updated record.

| Type                                                 | Details                                                                                                                                                                                           |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `(data: Partial<RecordType>) => Promise<RecordType>` | A function that updates the record, modifies the associated <a href="#requeststate">RequestState</a>, and updates the latest updated record in the <a href="#useupdateone">useUpdateOne</a> hook. |
```
