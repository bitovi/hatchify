# Adding forms to the DataGrid

Although Hatchify does not currently provide out-of-the-box components for forms, it does provide the tools to make it easy to add them to your application. This guide will walk you through the process of adding form-like behavior to the DataGrid we created in the [getting started guide](../../README.md). For the sake of simplicity, we will put our add and edit forms in modals on the same page as the DataGrid. If your application already has routing, you may want to create separate pages for the forms.

## Prerequisites

This guide assumes you have already completed the [getting started guide](../../README.md).

### Replacing Everything with a DataGrid

Before we even start adding forms, we need to replace the `Everything` component with a Todo `DataGrid` component. With Hatchify, this is as simple as pulling the `DataGrid` component off of the `hatchifyReact` object and rendering it.

We will replace

```tsx
const { Everything } = hatchedReact

// ...

<Everything />
```

with

```tsx
const { DataGrid } = hatchedReact.components.Todo

// ...

<DataGrid />
```

## Adding a todo

Now that we have a `DataGrid` component, we can get started by adding a form modal and buttons to open it.

### Components

#### Buttons

Let's begin by adding state to our `App` component to track whether the dialog is open or not.

```tsx
import { useState } from "react"

// ...

const App: React.FC = () => {
    const [open, setOpen] = useState(false); //👀

    // ...
```

Next, we will add two buttons to open the dialog. One will be for creating a new todo and the other will be for editing an existing todo.

In our `App` component's JSX, we will add the following above the `DataGrid` component.

```tsx
import { Button, createTheme, ThemeProvider } from "@mui/material"

// ...

<Button onClick={() => setOpen(true)}>Add Todo</Button>
<DataGrid />
```

Next, we will add a Todo `Column` compound component, which will contain the edit button.

```tsx
const { DataGrid, Column } = hatchedReact.components.Todo

// ...

<DataGrid>
    <Column
        label="Action"
        renderDataValue={() => (
            <Button
                onClick={() => {
                    setOpen(true)
                }}
            >
                Edit
            </Button>
        )}
    />
</DataGrid>
```

#### Form Input

Before we start writing our modal component, let's create an `Input` component that we can use in our form. We will use the [TextField component](https://mui.com/components/text-fields/) from Material UI. This input component will make sure our modal component is more readable.

Inside of `frontend/components/FormInput.tsx`, we will add the following:

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

#### Form Modal

Now that we have a reusable input component, we can create our modal component:

```tsx
import { useEffect, useState } from "react"
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from "@mui/material"
import type { RecordType } from "@hatchifyjs/react"
import FormInput from "./FormInput.js"
import * as Schemas from "../../schemas.js"

export default function TodoFormModal({ todo, open, handleClose }: { todo?: RecordType<typeof Schemas, typeof Schemas.Todo>; open: boolean; handleClose: () => void }) {
  const [values, setValues] = useState({
    name: todo?.name ?? "",
    importance: todo?.importance ?? "0",
  })

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  useEffect(() => {
    if (open) {
      setValues({
        name: todo?.name ?? "",
        importance: (todo?.importance ?? 0).toString(),
      })
    }
  }, [open, todo])

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {todo ? "Edit" : "Add"} Todo {todo ? `[${todo.id}]` : ""}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={4}>
          <FormInput name="name" label="Name" type="text" value={values.name} onChange={onChange} />
          <FormInput name="importance" label="importance" type="number" value={values.importance} onChange={onChange} />
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>{todo ? "Edit" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  )
}
```

Lastly, we will add the modal to our `App` component.

```tsx
import TodoFormModal from "./components/TodoFormModal.js"

// ...

<HatchifyProvider>
    <TodoFormModal open={open} handleClose={() => setOpen(false)} />
    <Button onClick={() => setOpen(true)}>Add Todo</Button>
    // ...
```

Now, when we click the "Add Todo" button, we should see a modal with a form. However, the form doesn't do anything quite yet.

Before we start implementing the create and edit functionality, let's review the modal component.

First, our props:

- `todo` - The todo we are editing. If this is undefined, we are adding a new todo.
- `open` - Whether the modal is open or not.
- `handleClose` - A function to close the modal.

Second, our state:

- `values` - The values of the form inputs. We will use this to populate the form inputs and to send the data to the server.

Third, our functions:

- `onChange` - A function to update the state when the form inputs change.

Fourth, our effects:

- `useEffect` - This effect will run when the modal is opened or when the todo changes. If there is a todo, we will populate the form inputs with the todo's data. If there is no todo, we will clear the form inputs.

Finally, our JSX:

- `Dialog` - This is the dialog component from Material UI. It takes a boolean `open` prop and a function `onClose` prop. The `open` prop determines whether the dialog is open or not. The `onClose` prop is a function that will be called when the dialog is closed.
- `DialogTitle` - This is the title of the dialog. It will display "Add Todo" if there is no todo and "Edit Todo [id]" if there is a todo.
- `DialogContent` - This is the content of the dialog. It contains the form inputs.
- `DialogActions` - This is the actions of the dialog. It contains the cancel and submit buttons.

### Logic

Now that we have a form, we need to add the logic to create todos. Although Hatchify does not currently provide out-of-the-box form components, it does provide the type-safe functions to make it easy to create, edit, and delete records.

Inside of `frontend/components/TodoFormModal.tsx`, we will import the `hatchedReact` object from our `App` component and then add the hook to the `TodoFormModal` component.

```tsx
import { hatchedReact } from "../App.js"

// ...

const [createTodo] = hatchedReact.model.Todo.useCreateOne()
```

Next, let's add a `handleSubmit` function to our `TodoFormModal` that will be called when the button inside of the `DialogActions` component is clicked.

```tsx
const handleSubmit = () => {
  if (!todo) {
    createTodo({
      name: values.name,
      importance: Number(values.importance),
    })
  }
}
```

Finally, we will add the `handleSubmit` function to the `onClick` prop of the submit button.

```tsx
<Button onClick={handleSubmit}>{todo ? "Edit" : "Add"}</Button>
```

Now, when we click the submit button, we should see a new todo appear in the DataGrid.

## Editing a Todo

Now that we have a form to create todos, let's add the functionality to edit todos.

### Logic

Our `TodoFormModal` is already set up to accept a todo as prop. We just need to add the logic to update the todo, as well as the logic to set the todo we are editing.

First, we will add the `useUpdateOne` hook to our `TodoFormModal` component.

```tsx
const [updateTodo] = hatchedReact.model.Todo.useUpdateOne()

// ...

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
```

Next, let's circle back to our `App` component and add the state for the todo we would like to edit:

🛑 **this type is not working as expected when setting state**

```tsx
const [todoToEdit, setTodoToEdit] = useState<RecordType<typeof Schemas, typeof Schemas.Todo> | undefined>(undefined)
```

Then, we will update our `Edit` button to set the todo we would like to edit.

🛑 **should not need to cast type**

```tsx
<Button
  onClick={() => {
    setOpen(true)
    setTodoToEdit(record as RecordType<typeof Schemas, typeof Schemas.Todo>)
  }}
>
  Edit
</Button>
```

Don't foret to update the `handleClose` function to clear the todo we are editing:

```tsx
<TodoFormModal
  open={open}
  handleClose={() => {
    setOpen(false)
    setTodoToEdit(undefined)
  }}
  todo={todoToEdit}
/>
```

### Deleting a Todo

Now that we have a form to edit todos, let's add the functionality to delete todos.

Inside of our `App` component, we will add the `useDeleteOne` hook and update our column to have a delete button:

```tsx
const [deleteTodo] = hatchedReact.model.Todo.useDeleteOne()

// ...

renderDataValue={({ record }) => (
  <>
    <Button
      onClick={() => {
        setOpen(true)
        setTodoToEdit(
          record as RecordType<typeof Schemas, typeof Schemas.Todo>,
        )
      }}
    >
      Edit
    </Button>
    <Button
      onClick={() => {
        deleteTodo(record.id)
      }}
    >
      Delete
    </Button>
  </>
)}
```
