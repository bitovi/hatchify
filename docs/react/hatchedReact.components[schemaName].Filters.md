# hatchedReact.components[schemaName].Filters

The `Filters` component is used to filter and manage the data in a `DataGrid` component. This component can be used as a child of the `DataGrid` component and the MUI `DataGrid`.

## Import

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { Filters: TodoFilters } = hatchedReact.components.Todo.DataGrid
const { Filters: UserFilters } = hatchedReact.components.User.DataGrid
// or
const TodoFilters = hatchedReact.components.Todo.DataGrid.Filters
const UserFilters = hatchedReact.components.User.DataGrid.Filters
```

## Props

| Prop Name | Type                                    | Default | Description                                           |
| --------- | --------------------------------------- | ------- | ----------------------------------------------------- |
| filter    | [`FilterArray`](./types.md#filterarray) | -       | Defines the filters to enforce on the grid            |
| setFilter | `(filter: FilterArray) => void`         | -       | Accepts a filter array and updates the `filter` state |
| page      | `number`                                | -       | The current page                                      |
| setPage   | `(page: number) => void`                | -       | Accepts a page number and updates the `page` state    |
