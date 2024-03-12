# hatchedReact.components[schemaName].DataGrid.Column

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

| Prop Name              | Type                                                           | Default | Description                                                                                                                                                                                                                                              |
| ---------------------- | -------------------------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                | `string`                                                       | -       | The `label` will be what appears as the `Column` heading.                                                                                                                                                                                                |
| `name`                 | `string`                                                       | -       | The `name` is the key on the schema that will fill out each column row                                                                                                                                                                                   |
| `sortable`             | `boolean`                                                      | -       | If `true`, the `Column` will be sortable.                                                                                                                                                                                                                |
| `prepend`              | `boolean`                                                      | -       | If `true` the column will 'prepend' the other columns. If multiple columns are set to prepend, they will position in the order they are received                                                                                                         |
| `renderDataValue`      | `(record: [`RecordType`](types.md#recordtype)) => JSX.Element` | -       | Accepts a record of the [`RecordType`](types.md#recordtype) and returns a JSX.Element with the relevant schema data                                                                                                                                      |
| `DataValueComponent`   | [`DataValueComponent`](types.md/#datavaluecomponent)           | -       | A `React.FC` that allows you to customize the data component that is rendered. It accepts an object with the following properties: `ts {value: DataValue, record: DataValueRecord, control: FinalAttributes[string]["control"], field?: string \| null}` |
| `renderHeaderValue`    | [`RenderHeader`](types.md/#renderheader)                       | -       | A callback function that takes your `headerArgs: [HeaderProps](./types.md#headerprops)` and to dynamically render your your header value.                                                                                                                |
| `HeaderValueComponent` | [`HeaderValueComponent`](types.md/#headervaluecomponent)       | -       | A `React.FC` that allows you to customize the header component that is rendered for the column. It accepts an object of type [`HeaderProps`](types.md#headerprops)                                                                                                           |

## Unique Types
