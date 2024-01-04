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

| key              | description                                           |
| ---------------- | ----------------------------------------------------- |
| `data`           | An array of records of the schema type.               |
| `include`        | The included relationships                            |
| `meta`           | Meta data from the requests                           |
| `filter`         | The current filter                                    |
| `setFilter`      | Accepts a filter and updates the `filter` state       |
| `page`           | Current page                                          |
| `setPage`        | Accepts a page number and updates the `page` state    |
| `sort`           | The current state                                     |
| `setSort`        | Accepts a sort direction and updates the `sort` state |
| `selected`       | Accepts a filter and updates the `filter` state       |
| `setSelected`    | The current selected rows                             |
| `finalSchemas`   | The final shape of the schemas                        |
| `partialSchemas` | Schemas, in their partial state                       |
| `schemaName`     | The schema this data is for                           |
| `fields`         | an object of fields that are included                 |
| `include`        |an array of strings of the included relationships      |


### CreateType

This is the type used when data is created. It may be useful when prepping form data for record creation. This type will consist of the schema name and the attributes. `CreateType` is a generic type, so it requires the schema type when used.

```ts
  type TodoForm = Omit<CreateType<(typeof Schemas)["Todo"]>, "__schema">
  
  const [newTodo, setNewTodo] = useState<TodoForm>({
    name: "new todo",
    importance: "5",
  })
```

### UpdateType

This is the type used when data is updated. It may be useful when prepping form data for record updating. This type will consist of the record it, schema name, and the attributes.

```ts
  type TodoForm = Omit<UpdateType<(typeof Schemas)["Todo"]>, "__schema">

  const [editTodo, setEditTodo] = useState<TodoForm>({
    name: "new todo name",
    importance: "7",
  })
```

### HatchifyApp

This is the type of the Hatchify App that is generated with `hatchifyReact()`. It may be needed if you have services and want to type the service. It is a generic type that accepts a type parameter of the `Record<string, PartialSchema>` type.

```ts
  type HatchApp = HatchifyApp<{ Todo: (typeof Schemas)["Todo"] }>

const myServices = {
  hatchify: hatchifyReact(...),
  foo: ...,
  bar: ...
}
```

### RecordType

This type will match a record's schema, and can be useful for local form state when updating. Another generic type, this type accepts 2-4 parameters.

```ts
  type TodoForm = RecordType<
    { Todo: (typeof Schemas)["Todo"] },
    (typeof Schemas)["Todo"]
  >

  const [editTodo, setEditTodo] = useState<TodoForm>({
    name: "new todo name",
    importance: "7",
  })
```
