# Everything

API Reference docs for the Hatchify Everything component. Learn more about props.

The Hatchify `Everything` displays all available schemas by a navigation tab. The view will render with the first schema provided. In our example this will be `Todo` followed by `User`.

## Import

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { Everything } = hatchedReact.Everything
// or
const Everything = hatchedReact.Everything
```

## Props

| Prop Name        | Type                                     | Default | Description                                                                                                                                                                                                                                                                                     |
| ---------------- | ---------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| children         | React.ReactNode or Null                  | -       | While `DataGrid` can contain no children, typically we'll use hatchify's `Column` or `EmptyList` as children for this component.                                                                                                                                                                |
| defaultSelected  | HatchifyDataGridSelected["selected"]     | -       | This is the current state of column selection. To maintain it on the level this component is rendered pass the 'selected' state here.                                                                                                                                                           |
| onSelectedChange | HatchifyDataGridSelected["setSelected""] | -       | Pass the set function in order to update the current state into his prop.                                                                                                                                                                                                                       |
| defaultPage      | PaginationObject                         | -       | This object accepts a `number` and `size` variable. `number` is the page of information the `DataGrid` will start on. `size` is the number of rows shown on each page.                                                                                                                          |
| defaultSort      | SortObject                               | -       | This object accepts a `direction` and `sortBy` variable. `direction` can be either `asc` for ascending order, or `desc` for descending order. `sortBy` accepts the the key of any of the `DataGrid` columns, such as 'Name' or 'dueDate'. If given a non-matching key no records will be found. |
| baseFilter       | Filters                                  | -       | This object accepts a variety of different Filter shapes. One being an array of objects, a `FilterArray`, that contains a `field`, the column to filter, the `operator`, to determine the type of filter, and `value` is the the value we're comparing column data against for filtering.       |
| overwrite        | boolean                                  | -       | If `true` only provided `Column` children will render rather than the `DataGrid`.                                                                                                                                                                                                               |
| minimumLoadTime  | number                                   | -       | Set a minimum load time it takes for the prop to render. For some views a fast load time may appear to flicker too much                                                                                                                                                                         |

The option elements to populate the select with. For DataGrid, the props can be Column,

## Prop Details

### baseFilter

The potential `operators` for `baseFilter` are the following:
(Need to link to the operators, filering on jsonapi has them listed)
``

### Example

```tsx
//in App.tsx
const Everything = hatchedReact.Everything // 👀

const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Everything> {/* 👀 */}
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

Learn more about customizing `EmptyList` in [this guide](../guides/customizing-your-list.md).
