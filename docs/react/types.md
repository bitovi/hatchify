# Types

Types available for use within your Hatchify App.

- [`DataGridState`](#datagridstate)
- [`CreateType`](#createtype)
- [`UpdateType`](#updatetype)
- [`HatchifyApp`](#hatchifyapp)
- [`RecordType`](#recordtype)
- [`Primitive`](#primitive)
- [`Relationship`](#relationship)
- [`DataValue`](#datavalue)
- [`DataValueRecord`](#datavaluerecord)
- [`DataValueComponent`](#datavaluecomponent)
- [`RenderHeader`](#renderheader)
- [`HeaderValueComponent`](#headervaluecomponent)
- [`HeaderProps`](#headerprops)
- [`HeaderPropsCommon`](#headerpropscommon)
- [`HatchifyDataGridSelectedState`](#hatchifydatagridselectedstate)
- [`PaginationObject`](#paginationobject)
- [`SortObject`](#sortobject)
- [`Filters`](#filters)
- [`FilterArray`](#filterarray)
- [`FiltersObject`](#filtersobject)
- [`XDataGridProps`](#xdatagridprops)

## DataGridState

This is the return type of the `useDataGridState` hook. When using the state in an ejected pattern (separated out of `hatchedReact`) it may be necessary to type your data using this type.

This object type includes:

| key              | description                                                             |
| ---------------- | ----------------------------------------------------------------------- |
| `data`           | An array of records of the schema type.                                 |
| `include`        | The included relationships                                              |
| `meta`           | Meta data from the requests                                             |
| `filter`         | The current filter                                                      |
| `setFilter`      | Accepts a filter and updates the `filter` state                         |
| `page`           | Current page                                                            |
| `setPage`        | Accepts a page number and updates the `page` state                      |
| `sort`           | The current state                                                       |
| `setSort`        | Accepts a sort direction and updates the `sort` state                   |
| `selected`       | The current selected rows                                               |
| `setSelected`    | Accepts an array of selections and updates the `selected` state         |
| `finalSchemas`   | Schemas after assembly. These have more details and validator functions |
| `partialSchemas` | Schemas, as the user defined in the app                                 |
| `schemaName`     | The schema this data is for                                             |
| `fields`         | An object of fields that are included                                   |
| `include`        | An array of strings of the included relationships                       |

Further, the `meta` object includes:

| key              | description                          |
| ---------------- | ------------------------------------ |
| `error`          | Error message if in error state      |
| `isResolved`     | False when loading, true otherwise   |
| `isPending`      | True when loading, false otherwise   |
| `isRejected`     | True when error, false otherwise     |
| `isRevalidating` | True when loading after initial call |
| `isStale`        | True when loading after initial call |
| `isSuccess`      | True on success, false otherwise     |
| `meta`           | Any meta data for the request        |
| `status`         | "loading", "success", or "error"     |

## CreateType

`CreateType` is the type used when data is created. It may be useful when prepping form data for record creation. This type will consist of the schema name and the attributes. `CreateType` is a generic type, so it requires the schema type when used.

```ts
type TodoForm = Omit<CreateType<(typeof Schemas)["Todo"]>, "__schema"> // 👀

const [newTodo, setNewTodo] = useState<TodoForm>({
  name: "new todo",
  importance: "5",
})
```

## UpdateType

`UpdateType` is the type used when data is updated. It may be useful when prepping form data for record updating. This type will consist of the record id, schema name, and the attributes.

```ts
type TodoForm = Omit<UpdateType<(typeof Schemas)["Todo"]>, "__schema"> // 👀

const [editTodo, setEditTodo] = useState<TodoForm>({
  name: "new todo name",
  importance: "7",
})
```

## HatchifyApp

`HatchifyApp` is the type of the Hatchify App that is generated with `hatchifyReact()`. It may be needed if you have services and want to type the service. It is a generic type that accepts a type parameter of the `Record<string, PartialSchema>` type.

```ts
  type HatchApp = HatchifyApp<{ Todo: (typeof Schemas)["Todo"] }> // 👀

const myServices = {
  hatchify: hatchifyReact(...),
  foo: ...,
  bar: ...
}
```

## RecordType

`RecordType` will match a record's schema, and can be useful for local form state when updating. This generic type accepts 2-4 parameters.

Parameters:

| type                            | description                                                                   |
| ------------------------------- | ----------------------------------------------------------------------------- |
| `Record<string, PartialSchema>` | The type of the user defined schema as a `Record` object                      |
| `PartialSchema`                 | The type of the user defined schema                                           |
| `boolean`                       | True to allow `Date` to be type `Date or String`, false to only allow `Date`  |
| `boolean`                       | Keep type safety for schema attributes, while allowing custom computed fields |

```ts
// 👀
type TodoForm = RecordType<{ Todo: (typeof Schemas)["Todo"] }, (typeof Schemas)["Todo"], false, false>

const [editTodo, setEditTodo] = useState<TodoForm>({
  name: "new todo name",
  importance: "7",
})
```

## `HatchifyDataGridSelectedState`

```ts
interface HatchifyDataGridSelectedState = {
  all: boolean
  ids: string[]
}
```

## `HatchifyDataGridSelected`

```ts
interface HatchifyDataGridSelected = {
  selected: HatchifyDataGridSelectedState
  setSelected: (selected: HatchifyDataGridSelectedState) => void
}
```

## `PaginationObject`

```ts
interface PaginationObject = {
  number: number
  size: number
}
```

## `SortObject`

```ts
interface SortObject {
  direction: "asc" | "desc" | undefined
  sortBy: string | undefined
}
```

## `FilterTypes`

```ts
type FilterTypes = "$eq" | "$ne" | "$gt" | "$gte" | "$lt" | "$lte" | "$in" | "$nin" | "$like" | "$ilike" | "empty" | "nempty"
```

## `Filters`

```ts
type Filters = FilterArray | FiltersObject | string | undefined
```

## `FilterArray`

```ts
type FilterArray = Array<{
  field: string
  operator: string
  value: string | string[] | number | number[] | boolean | boolean[]
}>
```

## `FiltersObject`

```ts
type FiltersObject = {
  [field: string]: {
    [filter in FilterTypes]?: string | string[] | number | number[] | boolean | boolean[]
  }
}
```

## Primitive

```ts
type Primitive = string | boolean | number
```

## `Relationship`

```ts
type Relationship = {
  id: string
  label: string
  [field: string]: Primitive
}
```

## `DataValue`

```ts
type DataValue = Primitive | Relationship | Relationship[]
```

## `DataValueRecord`

```ts
type DataValueRecord = {
  id: string | number
  [field: string]: DataValue
}
```

## `DataValueComponent`

```ts
type DataValueComponent = React.FC<{
  value: DataValue
  record: DataValueRecord
  control: FinalAttributeRecord[string]["control"]
  field?: string | null
}>
```

## `HeaderProps`

```ts
type HeaderProps =
  | (HeaderPropsCommon & {
      column: HatchifyColumn
    })
  | (HeaderPropsCommon & {
      column: Omit<HatchifyColumn, "headerOverride" | "renderData" | "renderHeader">
    })
```

## HeaderPropsCommon

```ts
interface HeaderPropsCommon {
  direction: SortObject["direction"]
  meta: Meta
  setSort: HatchifyDataGridSort["setSort"]
  sortBy: SortObject["sortBy"]
}
```

## `RenderHeader`

```ts
type RenderHeader = (headerArgs: HeaderProps) => JSX.Element
```

## `HeaderValueComponent`

```ts
type HeaderValueComponent = React.FC<HeaderProps>
```

## `XDataGridProps`

| prop            | type              | description                                                         |
| --------------- | ----------------- | ------------------------------------------------------------------- |
| `children`      | `React.ReactNode` | The children components to be rendered within the custom `DataGrid` |
| `overwrite`     | `boolean`         | When `true`, will only render the children given to the component   |
| `listWrapperId` | `string`          | The `id` assigned to the `List` wrapper component                   |
| `fitParent`     | `boolean`         | Manages dimensions of the `List` compared to it's parent            |

```ts
interface XDataGridProps<
  TSchemas extends Record<string, PartialSchema> = any,
  TSchemaName extends GetSchemaNames<TSchemas> = any,
> extends <a href="#datagridstate">DataGridState</a><TSchemas, TSchemaName> {
  children?: React.ReactNode
  overwrite?: boolean
  minimumLoadTime?: number
  listWrapperId?: string
  fitParent?: boolean
}
```
