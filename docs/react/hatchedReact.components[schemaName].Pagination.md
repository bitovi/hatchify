# hatchedReact.components[schemaName].Pagination

The `Pagination` custom component allows you to manage the pagination of a list of items. It accepts an object with properties `meta`, `page`, and `setPage` and returns a `React.FC<XDataGridProps>`:

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { Filters: TodoFilters } = hatchedReact.components.Todo
const { List: TodoList } = hatchedReact.components.Todo
const { Pagination: TodoPagination } = hatchedReact.components.Todo

const CustomTodoDataGrid = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState()

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoFilters {...todoState}/>
        <TodoList 
          {...todoState}
        />
        <TodoPagination 
          meta={todoState.meta}
          page={todoState.page}
          setPage={todoState.setPage}
        />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## Props

| Prop Name | Type | Default | Description |
| --- | --- | --- | --- |
| `meta` | [MetaObject](./types.md#metaobject) | - | The meta object from the `DataGridState` |
| `page` | [PaginationObject](./types.md#paginationobject) | - | The current page |
| `setPage` | `(page: number) => void` | - | A function to set the current page |
