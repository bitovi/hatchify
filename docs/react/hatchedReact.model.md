# hatchedReact.model

`hatchifyReact` has a sets of hooks and promises to be used depending on your app's preferences. Each set gives the ability to create, update, delete, and fetch records.

- [Promises](#promises)
  - [createOne](#createone)
  - [deleteOne](#deleteone)
  - [findAll](#findall)
  - [findOne](#findone)
  - [updateOne](#updateone)
- [Hooks](#hooks)
  - [useAll](#useall)
  - [useCreateOne](#usecreateone)
  - [useDeleteOne](#usedeleteone)
  - [useOne](#useone)
  - [useUpdateOne](#useupdateone)

## Promises

### createOne

`createOne` is an async function returns a promise used to create a single record. The function accepts a `CreateType` object of attributes to be added. On success, the promise will return the record (`RecordType`).

```tsx

  const createTodo = async () => {
    await hatchedReact.model.Todo.createOne({ // 👀
      id: "todo-id",
      name: "Go Running",
    }).then((res) => console.log(res))
  }

  ...

  <button onClick={() => createTodo()}>Create Todo</button>

```

### deleteOne

`deleteOne` is an async function returns a promise to delete a single record. It accepts a string equal to the id of the record to be fetched. On success, the promise will return `undefined`.

```tsx

  const deleteTodo = async () => {
    await hatchedReact.model.Todo.deleteOne("todo-id") // 👀
  }

  ...

  <button onClick={() => deleteTodo()}>Delete Todo</button>

```

### findAll

`findAll` is an async function returns a promise to fetch all records. It accepts a query object used to filter data. Optional parameters in the object include: `include`, `fields`, `filter`, `sort`, and `page`. On success, the promise will return the records (Array of `RecordType`).

```ts

  const fetchTodos = async () => {
    await hatchedReact.model.Todo.findAll({include: ["user"]}).then((res) => console.log(res)) // 👀
  }
  fetchTodos()

```

### findOne

`findOne` is an async function returns a promise to fetch a single record. It accepts a string equal to the id of the record to be fetched, OR an object that includes the `id`, `include`, and `fields`. On success, the promise will return the record (`RecordType`).

```ts

  const fetchOneTodo = async () => {
    await hatchedReact.model.Todo.findOne("todo-id").then((res) => console.log(res)) // 👀
  }
  fetchOneTodo()

```

OR

```ts

  const fetchOneTodo = async () => {
     // 👀
    await hatchedReact.model.Todo.findOne({id: "todo-id", include: ["user"], fields: ["name", "user.name"]).then((res) => console.log(res))
  }
  fetchOneTodo()

```

`id`: The id of the record<br>
`include`: an array of strings of any relationships to include<br>
`fields`: An array of string of any fields to include<br>

### updateOne

`updateOne` is an async function returns a promise to update a single record. This functions accepts an `UpdateType` object. On success, the promise will return the record (`RecordType`).

```tsx

  const updateTodo = async () => {
    await hatchedReact.model.Todo.updateOne({ // 👀
      id: "todo-id",
      name: "Go Running",
    }).then((res) => console.log(res))
  }

  ...

  <button onClick={() => updateTodo()}>Update Todo</button>

```

## Hooks

### useAll

`useAll` is a hook used to fetch all records. This takes no arguments, and returns a tuple that includes the returned data, and the status of the request.

```ts

    const [allTodos, allTodosState] = hatchedReact.model.Todo.useAll()

```

`allTodos` will be an array of `RecordType`
`allTodosState` will be a `Meta` object with information on the status of the request. This is the same meta data type as in the `useDatagridState`.

### useCreateOne

`useCreateOne` is a hook used to create a single record. This takes no arguments, and returns a tuple that includes a function to create the record, the status of the request, and the returned created record.

```tsx

  const [createTodo, createTodoState, created] = hatchedReact.model.Todo.useCreateOne() // 👀
  
  ...

  <button
    onClick={() =>
        createTodo({{/* 👀 */}
        name: "Grocery Shopping",
        })
      }
    >
    Create Todo
  </button>

```

`createTodo` is the function to be called to create a record. It accepts a `CreateType` object: the attributes of the record that will be created.

`createTodoState` will be a `Meta` object with information on the status of the request. This is the same meta data type as in the `useDatagridState`.

`created` will be undefined until a create request is made. It will then be a `RecordType` object of the created record.

### useDeleteOne

`useDeleteOne` is a hook used to delete a single record. This takes no arguments, and returns a tuple that includes a function to delete the record, and the status of the request.

```tsx

  const [deleteTodo, deleteTodoState] = hatchedReact.model.Todo.useDeleteOne() // 👀
  
  ...

  <button
    onClick={() =>
        deleteTodo("todo-id"){/* 👀 */}
      }
    >
    Delete Todo
  </button>

```

`deleteTodo` is the function to be called to delete a record. It accepts a string: the id of the record that will be deleted.

`deleteTodoState` will be a `Meta` object with information on the status of the request. This is the same meta data type as in the `useDatagridState`.

#### useOne

`useOne` is a hook used to fetch a single record. This takes one argument - the id of the record to be fetched, and returns a tuple that includes the returned data, and the status of the request.

```ts

  const [oneTodo, oneTodoState] = hatchedReact.model.Todo.useOne("todo-id")

```

`oneTodo` will be an object of `RecordType`
`oneTodoState` will be a `Meta` object with information on the status of the request. This is the same meta data type as in the `useDatagridState`.

### useUpdateOne

`useUpdateOne` is a hook used to update a single record. This takes no arguments, and returns a tuple that includes a function to update the record, the status of the request, and the returned updated data.

```tsx

  const [updateTodo, updateTodoState, updated] = hatchedReact.model.Todo.useUpdateOne() // 👀
  
  ...

  <button
    onClick={() =>
        updateTodo({{/* 👀 */}
        id: "todo-id",
        name: "new name",
        })
      }
    >
    Update Todo
  </button>

```

`updateTodo` is the function to be called to update. It accepts an  `UpdateType` object: the id of the records, and the attributes that will be updated. Any omitted attributes will not be changed or overwritten.

`updateTodoState` will be a `Meta` object with information on the status of the request. This is the same meta data type as in the `useDatagridState`.

`updated` will be undefined until an update is made. It will then be a `RecordType` object of the updated record.
