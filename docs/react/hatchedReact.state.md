# hatchedReact.state

The `hatchedApp.state` property independently manages the state of the components associated with your [schemas](../core/README.md) via the context provided from the [`HatchifyProvider`](./components.md#hatchify-provider)🛑.

`const todoState = hatchedApp.state.Todo`

The above `hatchedApp.state.[schema]` signature exposes the [`useDataGridState`](#usedatagridstate) hook for the given schema. This hook is used to configure custom data grid components and their states.

## useDataGridState

The [`useDataGridState({})`](#usedatagridstate) hook exists on each `hatchedApp.state.[schema]` object. [`useDataGridState({})`](#usedatagridstate) takes in and returns a [`DataGridState`](./types.md#datagridstate) typed object to allow you to customize the Data Grid subcomponents.

```tsx
const todoState = hatchedApp.state.Todo.useDataGridState({
  defaultSelected,
  onSelectedChange,
  fields,
  include,
  defaultPage,
  defaultSort,
  baseFilter,
  minimumLoadTime,
})
```

The below examples share a flow of using the prebuilt Hatchify [`DataGrid`](./hatchedReact.components.md#datagrid) vs. using the `useDataGridState` hook to individually customize the [`List`](./hatchedReact.components.md#list), [`Filters`](./hatchedReact.components.md#filters), and [`Pagination`](./hatchedReact.components.md#pagination) components that make up the DataGrid, rescpectively.

```tsx
import { createJsonapiClient, hatchifyReact, HatchifyProvider, List, Filters, Pagination  } from "@hatchify/react"

// Define your schemas
const schemas = { ...Todo }

// Create your Hatchify React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))

// Define your TodoDataGrid component
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

// Render the Hatchify DataGrid
const hatchedComponent = () => {
  return (
    <HatchifyProvider>
      <TodoDataGrid />
    </HatchifyProvider>
  )
}
```

```tsx
import { createJsonapiClient, hatchifyReact, HatchifyProvider, List, Filters, Pagination  } from "@hatchify/react"

// Define your schemas
const schemas = { ...Todo }

// Create your Hatchify React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))


// Render the your custom Hatchify components
const hatchedComponent = () => {

  todoState = {
    minimumLoadTime: 1000,
  }

  const myCustomFilterState = hatchedReact.state.Todo.useDataGridState({
    ...todoState,
    include: ["approvedBy"],
    fields: ["name"],
  })

  const myCustomListState = hatchedReact.state.Todo.useDataGridState({
    ...todoState,
    include: ["approvedBy"],
    fields: ["name"],
  })

  return (
    <HatchifyProvider>
      <MyCustomFilter {...myCustomFilterState} />
      <List {...myCustomListState} />
      <Pagination {...todoState} />
    </HatchifyProvider>
  )
}
```

## useDataGridState({})

The `useDataGridState({})` accepts an object with the following properties:

| key                | type                                                                                                                                                                                                                                                             | description                                                                                                             |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `defaultSelected`  | `{all: boolean; ids: string[];} \| undefined;`                                                                                                                                                                                                                   | Optional, used for checkboxes                                                                                           |
| `onSelectedChange` | `{all: boolean; ids: string[];} \| undefined;`                                                                                                                                                                                                                   | Optional, callback function used for checkboxes                                                                         |
| `fields`           | `[key: string]: string[];`                                                                                                                                                                                                                                       | Optional, fields to be included. If not defined, all fields from the schema and included relationships will be returned |
| `include`          | `(keyof TPartialSchema[relationships])[] \| string[]`                                                                                                                                                                                                            | Optional, relationships to be included                                                                                  |
| `defaultPage`      | `{ number: number; size: number; }`                                                                                                                                                                                                                              | Optional, default paginated page                                                                                        |
| `defaultSort`      | `{direction: "asc" \| "desc" \| undefined; \| sortBy: string \| undefined;}`                                                                                                                                                                                     | Optional, default sort direction                                                                                        |
| `baseFilter`       | `Array<{ field: string; operator: string; value: string \| string[] \| number \| number[] \| boolean \| boolean[];}> \| {[field: string]: {[filter in FilterTypes]?: string \| string[] \| number \| number[] \| boolean \| boolean[];}} \| string \| undefined` | Optional, a pre filter to be used alongside additional filters                                                          |

`useDataGridState({})` then returns a [`DataGridState`](./types.md#datagridstate) typed object.

```tsx

```
