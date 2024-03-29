# hatchedReact.components[schemaName].List

The `List` custom component is comprised of [MUI](https://mui.com/) components. It accepts an object of [`XDataGridProps`](types.md#xdatagridprops) and returns a `JSX.Element` with the following structure:

```tsx
<TableContainer style={{ maxHeight: height }}>
  <Table stickyHeader>
    <MuiHeaders {...props} columns={columns} />
    <MuiBody {...props} columns={columns} Empty={Empty} />
  </Table>
</TableContainer>
```

The `List` is used as an alternative to the `DataGrid` component when you want to customize the grid and it's children. The `List` component accepts all props from [`DataGridState`](types.md#datagridstate). It will generate the necessary columns and their headers based on the hatched schemas, but it will not include a pagination component. To include one, include the [`Pagination`](hatchedReact.components[schemaName].Pagination.md) component in your render. The following would display a `List` component with the `Todo` schema with a linked`Filters` component:

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { List: TodoList } = hatchedReact.components.Todo
const { Filters: TodoFilters } = hatchedReact.components.Todo

const TodoPage = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState()
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoFilters {...todoState}/>
        <TodoList 
          {...todoState}
        />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```
