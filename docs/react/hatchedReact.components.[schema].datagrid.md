# hatchedReact.components.[schemaName].DataGrid

Similar to the [MUI DataGrid](https://mui.com/x/react-data-grid/), the Hatchify `DataGrid` displays the records of a specific schema. It includes pagination, filtering and the ability to sort the grid.

For example, the following shows an example of the DataGrid in action:

![DataGrid Example](../attachments/data-grid-example.png)

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
  - [`HatchifyDataGridSelectedState`](#hatchifydatagridselectedstate)
  - [`PaginationObject`](#paginationobject)
  - [`SortObject`](#sortobject)
  - [`Filters`](#filters)
  - [`FilterArray`](#filterarray)
  - [`FiltersObject`](#filtersobject)
  
## Props

| Prop Name                                                   | Type                                                              | Default | Description                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------------- | ----------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`children`](#children)                                     | `React.ReactNode` or `null`                                       | -       | While `DataGrid` can render without children, you can use hatchify's `Column` or `EmptyList` as children for this component.                                                                                                                                                                               |
| [`defaultSelected`](#defaultselected-and-onselectedchange)  | [`HatchifyDataGridSelectedState`](#hatchifydatagridselectedstate) | -       | `defaultSelected` adds a checkbox selection column to the `DataGrid` and a default selected value to the checked state. This checked state is managed by `onSelectedChange`                                                                                                                                |
| [`onSelectedChange`](#defaultselected-and-onselectedchange) | [`HatchifyDataGridSelectedState`](#hatchifydatagridselectedstate) | -       | `onSelectedChange` accepts a `setSelected` function to update the state of the props checked status.                                                                                                                                                                                                       |
| [`defaultPage`](#defaultpage)                               | [PaginationObject](#paginationobject)                             | -       | `defaultsPage` accepts a `number` and `size` property. `number` is the initial paginated position of the `DataGrid`. `size` controls the maximum number of rows shown on each page.                                                                                                                        |
| [`defaultSort`](#defaultsort)                               | [SortObject](#sortobject)                                         | -       | [`defaultSort`](#defaultsort) accepts a `direction` and `sortBy` property. `direction` can be `asc` for ascending order, or `desc` for descending order. `sortBy` accepts the the key of any of the `DataGrid` columns, such as 'Name' or 'dueDate'. If given a non-matching key no records will be found. |
| [`baseFilter`](#basefilter)                                 | [Filters](#filters)                                               | -       | [`baseFilter`](#basefilter) accepts an array of filter objects,[`FilterArray`](#filterarray), that contains `field`, the column to filter, `operator`, to determine the filter method, and `value`, the value being compared and filtered against the column data.                                         |
| [`overwrite`](#overwrite)                                   | `boolean`                                                         | -       | When `true`, only the `Column` children provided will render rather than the `DataGrid`.                                                                                                                                                                                                                   |
| [`minimumLoadTime`](#minimumloadtime)                       | `number`                                                          | -       | Set a minimum load time in ms that it takes for the prop to render.                                                                                                                                                                                                                                        |

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

### `defaultSelected` and `onSelectedChange`

The `DataGrid` below will render with a checkbox selection column and a `Name` column. The `defaultSelected` prop sets the initial state of the checkbox selection column to `true` and the `onSelectedChange` prop will update the state and the checkbox selection column.

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

### `defaultPage`

The below example will set the initial page position to 1 and the maximum number of rows shown on each page to 5.

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

### `defaultSort`

The below example will set the initial sort direction to ascending and the column to sort by to `dueDate`.

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

### `baseFilter`

Sets a filter on the `DataGrid` that is immutable from the hatchify filter. The following `DataGrid` will show only records with an expiration date that contains "2023".

```tsx
const App = () =>{
  const value =
  return (
    <HatchifyProvider>
      <TodoDataGrid
        baseFilter={[{field: "expirationDate", operator: "$contains", value: "2023"}]}
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

The following example will only render the Age field column.

```tsx
const App = () =>{
  const value =
  return (
    <HatchifyProvider>
      <TodoDataGrid
        overwrite
      >
        <TodoDataGrid.Column label="Age" field="age" />
        <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

### `minimumLoadTime`

```tsx
const App = () =>{
  const value =
  return (
    <HatchifyProvider>
      <TodoDataGrid
        minimumLoadTime={6000}
      >
        <TodoDataGrid.Column label="Age" field="age" />
        <TodoDataGrid.Empty>There are no records available</TodoDataGrid.Empty>
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

### Setting baseFilter

The potential `operators` for `baseFilter` are the following:

| Operator                           | Description                                                                                                                            |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| [`$eq`](../jsonapi/reading/filtering/$eq.md)                    | Matches values that are equal to the given value.                                                                                      |
| [`$ne`](../jsonapi/reading/filtering/$ne.md)                    | Matches values that are not equal to the given value.                                                                                  |
| [`$gt`](../jsonapi/reading/filtering/$gt.md)                    | Matches if values are greater than the given value.                                                                                    |
| [`$gte`](../jsonapi/reading/filtering/$gte.md)                  | Matches if values are greater or equal to the given value.                                                                             |
| [`$lt`](../jsonapi/reading/filtering/$lt.md)                    | Matches if values are less than the given value.                                                                                       |
| [`$lte`](../jsonapi/reading/filtering/$lte.md)                  | Matches if values are less or equal to the given value.                                                                                |
| [`$in`](../jsonapi/reading/filtering/$in.md)                    | Matches any of the values in an array.                                                                                                 |
| [`$nin`](../jsonapi/reading/filtering/$nin.md)                  | Matches none of the values specified in an array.                                                                                      |
| [`$like`](../jsonapi/reading/filtering/$like.md)                | %foo → ends with foo<br>foo% → starts with<br>%foo% → contains<br>foo → equals                                                         |
| [`$ilike`](../jsonapi/reading/filtering/$ilike.md)              | %foo → ends with foo (insensitive)<br>foo% → starts with (insensitive)<br>%foo% → contains (insensitive)<br>foo → equals (insensitive) |
| [omitted operator](../jsonapi/reading/filtering/no-operator.md) | behavior varies, see table in Omitted Operators section below.                                                                         |

## Types

### `HatchifyDataGridSelectedState`

```ts
interface HatchifyDataGridSelectedState = {
  all: boolean
  ids: string[]
}
```

### `HatchifyDataGridSelected`

```ts
interface HatchifyDataGridSelected = {
  selected: HatchifyDataGridSelectedState
  setSelected: (selected: HatchifyDataGridSelectedState) => void
}
```

### `PaginationObject`

```ts
interface PaginationObject = {
  number: number
  size: number
}
```

### `SortObject`

```ts
interface SortObject {
  direction: "asc" | "desc" | undefined
  sortBy: string | undefined
}
```

### `FilterTypes`

```ts
type FilterTypes = "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte" | "$in" | "$nin" | "$like" | "$ilike" | "empty" | "nempty"
```

### `Filters`

```ts
type Filters = FilterArray | FiltersObject | string | undefined
```

### `FilterArray`

```ts
type FilterArray = Array<{
  field: string
  operator: string
  value: string | string[] | number | number[] | boolean | boolean[]
}>
```

### `FiltersObject`

```ts
type FiltersObject = {
  [field: string]: {
    [filter in FilterTypes]?: string | string[] | number | number[] | boolean | boolean[]
  }
}
```
