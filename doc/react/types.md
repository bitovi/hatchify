# @hatchifyjs/react types

- [Types](#types)
- [DataGridState](#datagridstate)
- [CreateType](#createtype)
- [UpdateType](#updatetype)
- [HatchifyApp](#hatchifyapp)
- [RecordType](#recordtype)

## Types

Types available for use within your Hatchify App should you need them.

### DataGridState

This is the return type of the `useDataGridState` hook. When using the state in an ejected pattern (separated out of `hatchedReact`) it may be necessary to type your data using this type.

This object type includes:

| key              | description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `data`           | An array of records of the schema type.                                 |
| `include`        | The included relationships                                              |
| `meta`           | Meta data from the requests                                             |
| `filter`         | The current filter                                                      |
| `setFilter`      | Accepts a filter and updates the `filter` state                         |
| `page`           | Current page                                                            |
| `setPage`        | Accepts a page number and updates the `page` state                      |
| `sort`           | The current state                                                       |
| `setSort`        | Accepts a sort direction and updates the `sort` state                   |
| `selected`       | The current selected rows                                               |
| `setSelected`    | Accepts an array of selections and updates the `selected` state         |
| `finalSchemas`   | Schemas after assembly. These have more details and validator functions |
| `partialSchemas` | Schemas, as the user defined in the app                                 |
| `schemaName`     | The schema this data is for                                             |
| `fields`         | An object of fields that are included                                   |
| `include`        | An array of strings of the included relationships                       |

Further, the `meta` object includes:

| key              | description                          |
| ---------------- | ------------------------------------ |
| `error`          | Error message if in error state      |
| `isResolved`     | False when loading, true otherwise   |
| `isPending`      | True when loading, false otherwise   |
| `isRejected`     | True when error, false otherwise     |
| `isRevalidating` | True when loading after initial call |
| `isStale`        | True when loading after initial call |
| `isSuccess`      | True on success, false otherwise     |
| `meta`           | Any meta data for the request        |
| `status`         | "loading", "success", or "error"     |

### CreateType

`CreateType` is the type used when data is created. It may be useful when prepping form data for record creation. This type will consist of the schema name and the attributes. `CreateType` is a generic type, so it requires the schema type when used.

```ts
  type TodoForm = Omit<CreateType<(typeof Schemas)["Todo"]>, "__schema"> // 👀
  
  const [newTodo, setNewTodo] = useState<TodoForm>({
    name: "new todo",
    importance: "5",
  })
```

### UpdateType

`UpdateType` is the type used when data is updated. It may be useful when prepping form data for record updating. This type will consist of the record id, schema name, and the attributes.

```ts
  type TodoForm = Omit<UpdateType<(typeof Schemas)["Todo"]>, "__schema"> // 👀

  const [editTodo, setEditTodo] = useState<TodoForm>({
    name: "new todo name",
    importance: "7",
  })
```

### HatchifyApp

`HatchifyApp` is the type of the Hatchify App that is generated with `hatchifyReact()`. It may be needed if you have services and want to type the service. It is a generic type that accepts a type parameter of the `Record<string, PartialSchema>` type.

```ts
  type HatchApp = HatchifyApp<{ Todo: (typeof Schemas)["Todo"] }> // 👀

const myServices = {
  hatchify: hatchifyReact(...),
  foo: ...,
  bar: ...
}
```

### RecordType

`RecordType` will match a record's schema, and can be useful for local form state when updating. Another generic type, this type accepts 2-4 parameters.

```ts
 // 👀
  type TodoForm = RecordType<
    { Todo: (typeof Schemas)["Todo"] },
    (typeof Schemas)["Todo"],
    false,
    false
  >

  const [editTodo, setEditTodo] = useState<TodoForm>({
    name: "new todo name",
    importance: "7",
  })
```
