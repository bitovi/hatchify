# @hatchify/react - State

<-- STATE DEFINITION -->

- `hatchedApp.state` property independently manages the state of the components associated with your [schemas](../schema/README.md) via the context provided from the [`HatchifyProvider`](./components.md#hatchify-provider)🛑.

`const todoState = hatchedApp.state.Todo`

- The [`useDataGridState({})`](#useDataGridState) hook exists on each `hatchedApp.state.[schema]` object. [`useDataGridState({})`](#useDataGridState) takes in and returns a [`DataGridState`](./types.md#datagridstate) typed object.

`const todoState = hatchedApp.state.Todo.useDataGridState({})`

```tsx
import { createJsonapiClient, hatchifyReact, HatchifyProvider } from "@hatchify/react"

// Define your schemas
const schemas = { ...Todo }

// Create your Hatchify React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))

// Define your TodoDataGrid component
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

import { List, Filters, Pagination } from "@hatchictyjs/react";


const hatchedComponent = () => {

  const todoState = hatchedApp.state.Todo.useDataGridState({
    defaultSelected: initially highlighted rows (checkbox on each row)
    onSelectedChange: callback function when a selecion is made (checkbox on each row)
    fields: fields to be included (jsonapi) eg. fields=["name"] - does not return other fields, only the ones specified
    include: which relationships to include eg. include=["user", "user.friend"]
    defaultPage: initial pagination data
    defaultSort: initial sort direction for a column
    baseFilter: a pre filter to be used alongside additional filters
    minimumLoadTime: minimum time to show loading spinner
  }) // 👀

  Todo = name, date, user
  User = name, email, friend (user)

  no fields, include
  | name | date | user(.name)

  fields "name", no include
  | name |

  no fields, include user
  | name | date | user(.name) |

  no fields, include user.friend
  | name | date | user(.name) |

  table by default renders whatever fields and to-one relationships
    if fields are specified, only those fields are rendered
    if include is specified, those relationships are included

  todoState = {
    data: Record[],
    columns: Column[], // based off of schema
    filters, setFilters
    page, setPage,
    sort, setSort
  }

  return (
    <HatchifyProvider>
      <Filters {...todoState} />
      <List {...todoState} />
      <MyCustomPagination page={todoState.page} setPage={todoState.setPage} />
      // <TodoDataGrid />
    </HatchifyProvider>
  )
}
```

## useDataGridState({})

The `useDataGridState({})` accepts and returns a [`DataGridState`](./types.md#datagridstate) typed object with the following parameters/keys:

| key                | type                                        | description                                                                                                                       |
| ------------------ | ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | 
| `defaultSelected`  | `{all: boolean; ids: string[];}| undefined;`| Optional, used for checkboxes          |
| `onSelectedChange` | `{all: boolean; ids: string[];}| undefined;`| Optional, used for checkboxes          |
| `fields`           | `[key: string]: string[];`| Optional, fields to be included. If not defined, all fields from the schema and included relationships will be returned |
| `include`          | `(keyof TPartialSchema["relationships"])[]| string[]`| Optional, relationships to be included |
| `defaultPage`      | `{ number: number; size: number; }`| Optional, default paginated page                                                                                                  |
| `defaultSort`      | `{direction: "asc"|"desc"|undefined;|sortBy: string|undefined;}`|Optional, default sort direction |
| `baseFilter`       | `Array<{ field: string; operator: string; value: string | string[] | number | number[] | boolean | boolean[];}> | {[field: string]: {[filter in FilterTypes]?: string | string[] | number | number[] | boolean | boolean[];}} | string | undefined` | Optional, a pre filter to be used alongside additional filters |
