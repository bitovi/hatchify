# @hatchifyjs/react components

@hatchifyjs/react has several components available to use in your React app. There are two sets of components to be used.

The hatchifyReact Components are included in the HatchifyApp, and have access to the state from the provider.

The Material UI components are intended for use in instances when customization is needed. These require ejecting the Hatchify state from the HatchifyApp and manually passed back in as a prop.

- [hatchifyReact Components](#hatchifyreact-components)
  - [DataGrid](#hatchify-datagrid)
  - [Column](#hatchify-column)
  - [Empty](#hatchify-empty)
- [Material UI components](#material-ui-components)
  - [List](#list)
  - [Pagination](#pagination)
  - [Filters](#filters)
  - [DataGrid](#datagrid)

## hatchifyReact Components

### Hatchify DataGrid

Similar to the MUI DataGrid, this displays the records of a specific schema, but the state does not have to be passed in.

```tsx
//in App.tsx
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid/>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```

### Hatchify Column

The Column component is used anytime there is a need to customize the output of a specific column. This can be used as a child of both the Hatchify `DataGrid` and the MUI `DataGrid`.

```tsx
//in App.tsx
const TodoColumn = hatchedReact.components.Todo.Column

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoColumn
            label="Action"
            renderDataValue={({ record }) => {
              return (
                <>
                  <button onClick={() => console.log(record)}>
                    More Actions
                  </button>
                </>
              )
            }}
          />
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```

### Hatchify Empty

This component is used to customize what is displayed when the Hatchify `DataGrid` has no records to display.

```tsx
//in App.tsx
const TodoEmptyList = hatchedReact.components.Todo.Empty

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid>
          <TodoEmptyList>No records to display</TodoEmptyList>
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```

## Material UI Components

@hatchifyjs/react provides access to the components directly separate from the Hatchify state layer. You can use this approach when needing to customize how the state of the records are displayed.

### List

Used for displaying rows of records.

```tsx
//in App.tsx

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["user"]
})
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <List {...state}>
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```

![Example List Component](../../doc/attachments/List.png)

### Pagination

Used for paginating data in the table.

```tsx
//in App.tsx

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["user"]
})
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <List {...state}>
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
        <Pagination {...state} />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```

![Example List with Pagination](../../doc/attachments/ListWithPagination.png)

### Filters

Used for filtering data in the table.

```tsx
//in App.tsx

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["user"]
})
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Filters {...state} />
        <List {...state}>
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
        <Pagination {...state} />
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```

![Example Closed Filter](../../doc/attachments/FiltersClosed.png)
![Example Open Filter](../../doc/attachments/FiltersOpen.png)

### DataGrid

Used for displaying records. This component is comprised of `Filters`, `List`, and `Pagination`

```tsx
//in App.tsx

const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["user"]
})
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <DataGrid {...state}>
          <TodoEmptyList>No records to display</TodoEmptyList>
        </DataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

```
