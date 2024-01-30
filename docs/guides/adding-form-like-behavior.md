# Adding form-like behavior to the DataGrid

Although Hatchify does not currently provide out-of-the-box components for forms, it does provide the tools to make it easy to add them to your application. This guide will walk you through the process of adding form-like behavior to application we created in the [getting started guide](../../README.md). For the sake of simplicity, we will put our add and edit forms in modals. If your application already has routing, you may want to create separate pages for the forms.

- [Prerequisites](#prerequisites)
- [Components](#components)
  - [`FormInput.tsx`](#forminputtsx)
  - [`TodoFormModal.tsx`](#todoformmodaltsx)
  - [`App.tsx`](#apptsx)
- [Hatchify Create, Update, and Delete Functionality](#hatchify-create-update-and-delete-functionality)
  - [`useCreateOne`](#usecreateone)
  - [`useUpdateOne`](#useupdateone)
  - [`useDeleteOne`](#usedeleteone)
  - [Promises](#promises)

## Prerequisites

This guide assumes you have already completed the [getting started guide](../../README.md).

## Components

### `FormInput.tsx`

To keep our code DRY, we will create a reusable input component that we can use in our forms. This component will use the [TextField component](https://mui.com/components/text-fields/) from Material UI. This input component will make sure our modal component is more readable.

Let's create a new file at `frontend/components/FormInput.tsx` and add the following:

```tsx
import type { TextFieldProps } from "@mui/material"
import { TextField, Grid } from "@mui/material"

export default function FormInput({
  children,
  ...inputProps
}: {
  children?: React.ReactNode
} & TextFieldProps) {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        variant="standard"
        name={inputProps.name}
        label={inputProps.label}
        type={inputProps.type}
        value={inputProps.value}
        onChange={inputProps.onChange}
        InputLabelProps={{
          shrink: true,
        }}
        {...inputProps}
      >
        {children}
      </TextField>
    </Grid>
  )
}
```

### `TodoFormModal.tsx`

Now that we have a reusable input component, we can create our modal component. For the purpose of this guide, we will be creating a simplified Todo, only providing the name and importance attributes. With the building blocks provided in these snippets, you will be able to build out a full todo form with inputs for all attributes & relationships. Here's the full code, which we will break down below:

```tsx
import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material"
import type { RecordType } from "@hatchifyjs/react"
import { hatchedReact } from "../App.js"
import FormInput from "./FormInput.js"
import * as Schemas from "../../schemas.js"

export default function TodoFormModal({
  todo, // The todo we are editing. If this is undefined, we are adding a new todo.
  open, // Whether the modal is open or not.
  handleClose, // A function to close the modal.
}: {
  // 🛑 `RecordType` should be `HatchifyRecord`?
  todo?: RecordType<typeof Schemas, typeof Schemas.Todo>
  open: boolean
  handleClose: () => void
}) {
  // This hatchify hook will create a new todo.
  const [createTodo] = hatchedReact.model.Todo.useCreateOne()
  // This hatchify hook will update an existing todo.
  const [updateTodo] = hatchedReact.model.Todo.useUpdateOne()
  // This hook will keep track of the values of the form inputs.
  const [values, setValues] = useState({
    name: todo?.name ?? "",
    importance: todo?.importance ?? "0",
  })

  // A function to update the state when the form inputs change.
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  // A function to submit the form. If there is no todo, we will create a new todo.
  // If there is a todo, we will update the todo.
  const handleSubmit = () => {
    if (!todo) {
      createTodo({
        name: values.name,
        importance: Number(values.importance),
      })
    } else {
      updateTodo({
        id: todo.id,
        name: values.name,
        importance: Number(values.importance),
      })
    }
    handleClose()
  }

  // This effect will run when the modal is opened or when the todo changes. If there is
  // a todo, we will populate the form inputs with the todo's data. If there is no todo,
  // we will clear the form inputs.
  useEffect(() => {
    setValues({
      name: todo?.name ?? "",
      importance: (todo?.importance ?? 0).toString(),
    })
  }, [open, todo])

  return (
    // This is the dialog component from Material UI. It takes a boolean `open` prop and a function `onClose` prop. The `open` prop determines whether the dialog is open or not. The `onClose` prop is a function that will be called when the dialog is closed.
    <Dialog open={open} onClose={handleClose}>
      {/* This is the title of the dialog. It will display "Add Todo" if there is
      no todo and "Edit Todo [id]" if there is a todo. */}
      <DialogTitle>
        {todo ? "Edit" : "Add"} Todo {todo ? `[${todo.id}]` : ""}
      </DialogTitle>
      {/* This is the content of the dialog. It contains the form inputs. */}
      <DialogContent>
        <Grid container spacing={4}>
          <FormInput name="name" label="Name" type="text" value={values.name} onChange={onChange} />
          <FormInput name="importance" label="Importance" type="number" value={values.importance} onChange={onChange} />
        </Grid>
      </DialogContent>
      {/* This is the actions of the dialog. It contains the cancel and submit
      buttons. */}
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{todo ? "Edit" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  )
}
```

In this `TodoFormModal` component, we are using the hatchify hooks to create and update todos. For the sake of simplicity, we are not using the full power of the hooks. Their full functionality is described in the [Hatchify Create, Update, and Delete Functionality](#hatchify-create-update-and-delete-functionality) section below.

### `App.tsx`

Now that we have a form modal to create and edit todos, let's add the logic to our `App` component to open the modal, keep track of the todo we are editing, and the ability to delete todos.

```tsx
import { useState } from "react"
import { hatchifyReact, HatchifyProvider, createJsonapiClient, RecordType } from "@hatchifyjs/react"
import { Button, createTheme, ThemeProvider } from "@mui/material"
import * as Schemas from "../schemas.js"
import TodoFormModal from "./components/TodoFormModal.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { DataGrid, Column } = hatchedReact.components.Todo

const App: React.FC = () => {
  // Whether the dialog is open or not.
  const [open, setOpen] = useState(false)
  // The todo we are editing.
  const [todoToEdit, setTodoToEdit] = useState<RecordType<typeof Schemas, typeof Schemas.Todo> | undefined>(undefined) // 🛑 **can we simplify this type, or rename it to `HatchifyRecord`?**
  // This hook will delete a todo.
  const [deleteTodo] = hatchedReact.model.Todo.useDeleteOne()

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        {/* This is the form modal we created above. */}
        <TodoFormModal
          open={open}
          handleClose={() => {
            setOpen(false)
            setTodoToEdit(undefined)
          }}
          todo={todoToEdit}
        />
        {/* This button will open the form modal and allow us to add a new todo. */}
        <Button onClick={() => setOpen(true)}>Add Todo</Button>
        {/* This is the DataGrid component from Hatchify. It will display all of our todos. */}
        <DataGrid>
          {/* This is a column in the DataGrid. We are using to add an additional column for the edit and delete buttons. */}
          <Column
            label="Action"
            // This is a function that will be called for each row in the DataGrid. It will render the edit and delete buttons for each row.
            renderDataValue={({ record }) => (
              <>
                <Button
                  onClick={() => {
                    setOpen(true)
                    setTodoToEdit(
                      record as RecordType<typeof Schemas, typeof Schemas.Todo>, // 🛑 **bug; should not have to cast!**
                    )
                  }}
                >
                  Edit
                </Button>
                <Button onClick={() => deleteTodo(record.id)}>Delete</Button>
              </>
            )}
          />
        </DataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

Similar to our `TodoFormModal` component, in the `App` component we are using the hatchify hooks to delete todos. The full functionality of the delete hook is described in the [Hatchify Create, Update, and Delete Functionality](#hatchify-create-update-and-delete-functionality) section below.

## Hatchify Create, Update, and Delete Functionality

Although Hatchify does not provide out-of-the-box components for forms, it does provide the tools to make it easy to add them to your application. In the above examples, we did not leverage the full strength of the hooks for simplicity. In this section, we will explore the hooks in more detail.

### `useCreateOne`

```tsx
const [createTodo, meta, data] = hatchedReact.model.Todo.useCreateOne()
```

The `useCreateOne` hook returns a tuple with three values:

- `createTodo({ ...attributes, ...relationships })` - A function that will create a new todo.
- `meta` - An object that contains the status of the request.
  - `status` - "loading", "success", or "error".
  - `meta` - The meta data of the request.
  - `error` - The error of the request.
  - `isResolved` - Whether the request is resolved or not.
  - `isPending` - Whether the request is pending or not.
  - `isRejected` - Whether the request is rejected or not.
  - `isRevalidating` - Whether the request is revalidating or not.
  - `isStale` - Whether the request is stale or not.
  - `isSuccess` - Whether the request is successful or not.
- `data` - The created todo.

### `useUpdateOne`

```tsx
const [updateTodo, meta, data] = hatchedReact.model.Todo.useUpdateOne()
```

The `useUpdateOne` hook returns a tuple with three values:

- `updateTodo({ id, ...attributes, relationships })` - A function that will update an existing todo.
- `meta` - An object that contains the status of the request.
  - `status` - "loading", "success", or "error".
  - `meta` - The meta data of the request.
  - `error` - The error of the request.
  - `isResolved` - Whether the request is resolved or not.
  - `isPending` - Whether the request is pending or not.
  - `isRejected` - Whether the request is rejected or not.
  - `isRevalidating` - Whether the request is revalidating or not.
  - `isStale` - Whether the request is stale or not.
  - `isSuccess` - Whether the request is successful or not.
- `data` - The updated todo.

### `useDeleteOne`

```tsx
const [deleteTodo, meta, data] = hatchedReact.model.Todo.useDeleteOne()
```

The `useDeleteOne` hook returns a tuple with two values:

- `deleteTodo(id)` - A function that will delete an existing todo.
- `meta` - An object that contains the status of the request.
  - `status` - "loading", "success", or "error".
  - `meta` - The meta data of the request.
  - `error` - The error of the request.
  - `isResolved` - Whether the request is resolved or not.
  - `isPending` - Whether the request is pending or not.
  - `isRejected` - Whether the request is rejected or not.
  - `isRevalidating` - Whether the request is revalidating or not.
  - `isStale` - Whether the request is stale or not.
  - `isSuccess` - Whether the request is successful or not.

### Promises

If you prefer to use promises instead of hooks, you can use the `createOne`, `updateOne`, and `deleteOne` functions from the `Todo` model.

```tsx
hatchedReact.model.Todo.createOne({ ...attributes, ...relationships })
```

```tsx
hatchedReact.model.Todo.updateOne({ id, ...attributes, relationships })
```

```tsx
hatchedReact.model.Todo.deleteOne(id)
```
