# hatchedReact.components[schemaName].DataGrid


Similar to the [MUI DataGrid](https://mui.com/x/react-data-grid/), the Hatchify `DataGrid` displays the records of a specific schema. It includes pagination, filtering and the ability to sort the grid.

For example, the following shows an example of the DataGrid in action:

[IMAGE]

To produce something similar, use the following code:

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
// or
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App = ()=>{
  return <TodoDataGrid>
      <TodoDataGrid.Column STUFF> 
  </TodoDataGrid>
}
```



## Props

| Prop Name        | Type                                     | Default | Description                                                                                                                                                                                                                                                                                     |
| ---------------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children         | React.ReactNode or Null                  | -       | While `DataGrid` can contain no children, typically we'll use hatchify's `Column` or `EmptyList` as children for this component.                                                                                                                                                                |
| defaultSelected  | HatchifyDataGridSelected["selected"]?     | -       | This is the current state of column selection. To maintain it on the level this component is rendered pass the 'selected' state here.                                                                                                                                                           |
| onSelectedChange | HatchifyDataGridSelected["setSelected""]? | -       | Pass the set function in order to update the current state into his prop.                                                                                                                                                                                                                       |
| defaultPage      | [PaginationObject]                         | -       | This object accepts a `number` and `size` variable. `number` is the page of information the `DataGrid` will start on. `size` is the number of rows shown on each page.                                                                                                                          |
| defaultSort      | [SortObject]                               | -       | This object accepts a `direction` and `sortBy` variable. `direction` can be either `asc` for ascending order, or `desc` for descending order. `sortBy` accepts the the key of any of the `DataGrid` columns, such as 'Name' or 'dueDate'. If given a non-matching key no records will be found. |
| baseFilter       | [Filters]                                  | -       | This object accepts a variety of different Filter shapes. One being an array of objects, a `FilterArray`, that contains a `field`, the column to filter, the `operator`, to determine the type of filter, and `value` is the the value we're comparing column data against for filtering.       |
| overwrite        | boolean                                  | -       | If `true` only provided `Column` children will render rather than the `DataGrid`.                                                                                                                                                                                                               |
| minimumLoadTime  | number                                   | -       | Set a minimum load time in ms that it takes for the prop to render. For some views a fast load time may appear to flicker too much.                                                                                                                                                              |

## Prop Details

### defaultSelected + onSelectedChange

For these props, you'll want to pass state variables made with React's `useState`.

```tsx
const [selected, setSelected] = useState<{ all: boolean; ids: string[] }>({
  all: false,
  ids: [],
})
```

### baseFilter

The potential `operators` for `baseFilter` are the following:
(Need to link to the operators, filering on jsonapi has them listed)
(Add a table probably)

### Example

```tsx
//in App.tsx
const TodoDataGrid = hatchedReact.components.Todo.DataGrid // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <TodoDataGrid defaultSelected={selected} defaultPage={{ number: 1, size: 5 }} defaultSort={{ direction: "asc", sortBy: "dueDate" }} baseFilter={[{field: "Name" operator: "$contains", value: "Walk"}]} overwrite minimumLoadTime={100} />
        <TodoColumn label="Name" name="name">
        <TodoEmpty>There are no records available</TodoEmpty>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## Customization

There are two different ways of customizing this behavior:

- Using compound components like [Column] and [Empty]
- 


but the state does not have to be passed in.
