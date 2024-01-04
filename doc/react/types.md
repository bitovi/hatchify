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

This object type includes:<br>
 `data`: An array of records of the schema type.<br>
 `include`: The included relationships<br>
 `meta`: Meta data from the requests

 Filter, pagination, sort and select variables and functions:<br>
  `filter`: The current filter<br>
  `setFilter`: Accepts a filter and updates the `filter` state<br>
  `page`: Current page<br>
  `setPage`: Accepts a page number and updates the `page` state<br>
  `sort`: The current state<br>
  `setSort`: Accepts a sort direction and updates the `sort` state<br>
  `selected`: The current selected rows<br>
  `setSelected`: Accepts an array of id's and updates the `selected` state<br>

 As well as schema related data://todo
  `finalSchemas`: The final shape of the schemas<br>
  `partialSchemas`: Schemas, in their partial state<br>
  `schemaName`: The schema this data is for<br>

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
