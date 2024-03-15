# hatchedReact.components

@hatchifyjs/react has several components available to use in your React app. There are two sets of components to be used.

The hatchifyReact Components are included in the HatchifyApp, and have access to the state from the provider.

- [DataGrid](#hatchify-datagrid)
- [Column](#hatchify-column)
- [Empty](#hatchify-empty)
- [List](#list)
- [Pagination](#pagination)
- [Filters](#filters)


## React Components Setup

Hatchify's components are currently used to:

- Provide a navigation utility to tab through different schemas
- Build filterable, paginated, and sortable grids.

**Accessing Components**

The [`Navigation`](./hatchedReact.Navigation.md) component is "all-schemas" aware and is available directly on [`hatchedReact`](#hatchedreact) as follows:

```js
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))
const Navigation = hatchedReact.Navigation
```

The grid components (ex: [DataGrid](./hatchedReact.components[schemaName].DataGrid.md)) are available on the `.components` for their specific schema type as follows:

```js
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))
hatchedReact.components.Todo.DataGrid
```

**Component Provider Dependencies**

Hatchify uses [MaterialUI](#mui-components) for design components. For example, Hatchify's `Navigation` component uses MaterialUI's [`<Tabs>`](https://mui.com/material-ui/react-tabs/) component "under the hood". You must provide these components to Hatchify. The way to do this is by providing your MaterialUI `ThemeProvider`.

Similarly, Hatchify has its own provider - [`HatchifyProvider`](#hatchifyprovider). `HatchifyProvider` provides components specific to the data being displayed. For example, you can swap out globally how you want to display dates (See [`HatchifyProvider`'s documentation](#hatchifyprovider) for more details).

You must provide both a MaterialUI and Hatchify provider for Hatchify's components to work. This is typically done in your application's root. See the example below how to do this:

```ts
import {
  hatchifyReact,
  createJsonapiClient,
  HatchifyProvider,          // Hatchify's provider
} from "@hatchifyjs/react"
import {
  createTheme,
  ThemeProvider
} from "@mui/material"       // Material's provider

import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact( createJsonapiClient("/api", Schemas) )

const App: React.FC = () => {

  // MaterialUI's ThemeProvider must be outside the HatchifyProvider:
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <HATCHIFY.COMPONENTS.HERE/>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

## DataGrid

Similar to the MUI DataGrid, the Hatchify [`DataGrid`](./hatchedReact.components[schemaName].DataGrid.md) displays the records of a specific schema, without the [`DataGridState`](./types.md#datagridstate) needing to be passed in.

```tsx
//in App.tsx
const TodoDataGrid = hatchedReact.components.Todo.DataGrid // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid /> {/* 👀 */}
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## DataGrid.Column

The [`DataGrid.Column`](./hatchedReact.components[schemaName].DataGrid.Column.md) component is used anytime there is a need to customize the output of a specific column. This can be used as a child of both the Hatchify `DataGrid` and the MUI `DataGrid`. Learn more about custom components in [this guide](../guides/customizing-your-list.md).

```tsx
//in App.tsx
const TodoColumn = hatchedReact.components.Todo.DataGrid  // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoDataGrid.Column {/* 👀 */}
            label="Todo"
            field="name"
          />
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## DataGrid.Empty

[`DataGrid.Empty`](./hatchedReact.components[schemaName].DataGrid.Empty.md) is used to customize what is displayed when the Hatchify `DataGrid` has no records to display. Learn more about customizing `EmptyList` in [this guide](../guides/customizing-your-list.md).

```tsx
//in App.tsx
const TodoEmptyList = hatchedReact.components.Todo.Empty // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoEmptyList>No records to display</TodoEmptyList> {/* 👀 */}
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## List

[`List`](./hatchedReact.components[schemaName].List.md) is used for displaying rows of records.

```tsx
//in App.tsx

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
    include: ["user"],
  }) // 👀

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <List {...todoState}>
          {/* 👀 */}
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

![Example List Component](../attachments/List.png)

## Pagination

[`Pagination`](./hatchedReact.components[schemaName].Pagination.md) is used for paginating data in the table.

```tsx
//in App.tsx

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
    include: ["user"],
  }) // 👀

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <List {...todoState}>
          {" "}
          {/* 👀 */}
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
        <Pagination {...state} />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

![Example List with Pagination](../attachments/ListWithPagination.png)

## Filters

[`Filters`](./hatchedReact.components[schemaName].Filters.md) is used for filtering data.

```tsx
//in App.tsx

const Filters = hatchedReact.components.Todo.Filters

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
    include: ["user"],
  }) // 👀

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Filters {...todoState} /> {/* 👀 */}
        <List {...todoState}>
          {" "}
          {/* 👀 */}
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
        <Pagination {...todoState} />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

![Example Closed Filter](../attachments/FiltersClosed.png)
![Example Open Filter](../attachments/FiltersOpen.png)
