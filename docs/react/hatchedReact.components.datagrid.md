# hatchedReact.components.[schemaName].DataGrid

Similar to the [MUI DataGrid](https://mui.com/x/react-data-grid/), the Hatchify `DataGrid` displays the records of a specific schema. It includes pagination, filtering and the ability to sort the grid.

For example, the following shows an example of the DataGrid in action:

[IMAGE]

To produce something similar, use the following code:

```tsx
//in App.tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoDataGrid = hatchedReact.components.Todo.DataGrid // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid
          defaultSelected={selected}
          defaultPage={{ number: 1, size: 5 }}
          defaultSort={{ direction: "asc", sortBy: "dueDate" }}
          baseFilter={[{field: "Name" operator: "$contains", value: "Walk"}]}
          overwrite
          minimumLoadTime={100}
        >
          <TodoDataGrid.Column label="Name" field="name" />
          <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
        </TodoDataGrid>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

- [Props](#props)
- [Prop Usage](#prop-usage)
  - [`children`](#children)
  - [`defaultSelected` & `onSelectedChange`](#defaultselected-and-onselectedchange)
  - [`defaultPage`](#defaultpage)
  - [`defaultSort`](#defaultsort)
  - [`baseFilter`](#basefilter)
  - [`overwrite`](#overwrite)
  - [`minimumLoadTime`](#minimumloadtime)
- [Types](#types)

  - [`HatchifyDataGridSelected`](#hatchifydatagridselected)
  - [`PaginationObject`](#paginationobject)
  - [`SortObject`](#sortobject)
  - [`Filters`](#filters)
  - [`FilterArray`](#filterarray)

- [Customization](#customization)

## Props

| Prop Name         | Type                                                                | Default | Description                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| children          | `React.ReactNode` or `null`                                         | -       | While `DataGrid` can render without children, you can use hatchify's `Column` or `EmptyList` as children for this component.                                                                                                                                                               |
| defaultSelected   | [`HatchifyDataGridSelected["selected"]`](#hatchifydatagridselected) | -       | `defaultSelected` adds a checkbox selection column to the `DataGrid` and a default selected value to the checked state. This checked state is managed by `onSelectedChange`                                                                                                                |
| onSelectedChange  | [`HatchifyDataGridSelected["selected"]`](#hatchifydatagridselected) | -       | `onSelectedChange` accepts a `setSelected` function to update the state of the props checked status.                                                                                                                                                                                       |
| defaultPage       | [PaginationObject](#paginationobject)                               | -       | `defaultsPage` accepts a `number` and `size` property. `number` is the initial paginated position of the `DataGrid`. `size` controls the maximum number of rows shown on each page.                                                                                                        |
| `defaultSort`     | [SortObject](#sortobject)                                           | -       | `defaultSort` accepts a `direction` and `sortBy` property. `direction` can be `asc` for ascending order, or `desc` for descending order. `sortBy` accepts the the key of any of the `DataGrid` columns, such as 'Name' or 'dueDate'. If given a non-matching key no records will be found. |
| `baseFilter`      | [Filters](#filters)                                                 | -       | `baseFilter` accepts an array of filter objects,[`FilterArray`](#filterarray), that contains `field`, the column to filter, `operator`, to determine the filter method, and `value`, the value being compared and filtered against the column data.                                        |
| `overwrite`       | `boolean`                                                           | -       | When `true`, only the `Column` children provided will render rather than the `DataGrid`.                                                                                                                                                                                                   |
| `minimumLoadTime` | `number`                                                            | -       | Set a minimum load time in ms that it takes for the prop to render.                                                                                                                                                                                                                        |

## Prop Usage

### `children`

The `DataGrid` can render without children, but typically you'll use hatchify's `DataGrid.Column` or `DataGrid.Empty` as children for this component.

```tsx
return (
  <DataGrid>
    <DataGrid.Column
      field="name"
      label="Name!"
      renderDataValue={({ record }) => {
        return <strong>{record.name}</strong>
      }}
    />
    <DataGrid.Empty>No todos found!</DataGrid.Empty>
  </DataGrid>
)
```

In the above example, the `DataGrid` will render it's children, `DataGrid.Column` and if no `records` are rendered, `DataGrid.Empty`.

### `defaultSelected` and `onSelectedChange`

For `defaultSelected` & `onSelectedChange`, you'll want to pass state variables made with React's `useState`.

```tsx
const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
  all: false,
  ids: [],
})

const App(){
  return (
    <HatchifyProvider>
      <TodoDataGrid
        defaultSelected={selected}
        onSelectedChange={setSelected}
      >
        <TodoDataGrid.Column
          label="Location"
          field="location"
          renderDataValue={({ record }) => {
            return <strong>{record.location}</strong>
          }} />
        <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

In the above example, the `DataGrid` will render with a checkbox selection column and a `Name` column. The `defaultSelected` prop sets the initial state of the checkbox selection column to `true` and the `onSelectedChange` prop will update the state and the checkbox selection column.

### `defaultPage`

Sets the initial paginated position of the `DataGrid` and the maximum number of rows shown on each page.

```tsx
const App(){
  return (
    <HatchifyProvider>
      <TodoDataGrid
        number={1}
        size={5}
      >
        <TodoDataGrid.Column
          label="Location"
          field="location"
          renderDataValue={({ record }) => {
            return <strong>{record.location}</strong>
          }} />
        <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

The above example will set the initial page position to 1 and the maximum number of rows shown on each page to 5.

### `defaultSort`

Sets the initial sort direction and column to sort by.

```tsx
const App(){
  return (
    <HatchifyProvider>
      <TodoDataGrid
        direction="asc"
        sortBy="dueDate"
      >
        <TodoDataGrid.Column label="Due Date" field="dueDate" />
        <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

The above example will set the initial sort direction to ascending and the column to sort by to `dueDate`.

### `baseFilter`

Sets a filter on the `DataGrid` that is immutable from the UI. Setting a base filter will create a filter that is always applied to the `DataGrid` when valid.

```tsx
const App = () =>{
  const value = 
  return (
    <HatchifyProvider>
      <TodoDataGrid
        baseFilter={[{field: "expirationDate", operator: "$contains", value: "Walk"}]}
      >
        <TodoDataGrid.Column label="First Name" field="first" />
        <TodoDataGrid.Column label="Last Name" field="last" />
        <TodoDataGrid.Column 
          label="Expiration Date"
          field="expirationDate"
          renderDataValue={({ record }) => {
            return <strong style={{color: "red"}}>{record.expirationDate}</strong>
          }}>
        <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

### `overwrite`

### `minimumLoadTime`

### Setting baseFilter

The potential `operators` for `baseFilter` are the following:
(Need to link to the operators, filering on jsonapi has them listed)
(Add a table probably)

## Types

### `HatchifyDataGridSelected`

### `PaginationObject`

### `SortObject`

### `Filters`

### `FilterArray`

## Customization

There are two different ways of customizing this behavior:

- Using compound components like [Column] and [Empty]
-

but the state does not have to be passed in.
