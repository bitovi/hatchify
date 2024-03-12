# hatchedReact.components.[schemaName].DataGrid.Column

The `Column` component is used anytime there is a need to customize the output of a specific column. This can be used as a child of both the Hatchify `DataGrid` and the MUI `DataGrid`.

## Import

```tsx
import { hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const { Column: TodoColumn } = hatchedReact.components.Todo.DataGrid
const { Column: UserColumn } = hatchedReact.components.User.DataGrid
// or
const TodoColumn = hatchedReact.components.Todo.DataGrid.Column
const UserColumn = hatchedReact.components.User.DataGrid.Column
```

## Props

| Prop Name            | Type                 | Default | Description                                                            |
| -------------------- | -------------------- | ------- | ---------------------------------------------------------------------- |
| label                | string               | -       | The `label` will be what appears as the `Column` heading.              |
| name                 | string               | -       | The `name` is the key on the schema that will fill out each column row |
| sortable             | boolean              | -       | If `true`, the `Column` will be sortable.                              |
| prepend              | boolean              | -       |                                                                        |
| renderDataValue      | func                 | -       |                                                                        |
| DataValueComponent   | DataValueComponent   | -       |                                                                        |
| renderHeaderValue    | func                 | -       |                                                                        |
| HeaderValueComponent | HeaderValueComponent | -       |                                                                        |

## Unique Types

### HatchifyDataGridSelected

```tsx
export interface HatchifyDataGridSelected {
  selected: {
    all: boolean
    ids: string[]
  }
  setSelected: ({ all, ids }: { all: boolean; ids: string[] }) => void
}
```
