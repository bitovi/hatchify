# @hatchifyjs/react

- [What is hatchifyjs/react](#what-is-hatchifyjsreact)
  - [TypeScript](#typescript)
  - [Types](#types)
  - [createJsonapiClient](#createjsonapiclient)
  - [HatchifyProvider](#hatchifyprovider)
  - [hatchifyReact](#hatchifyreact)
    - [Everything](#everything)
    - [components](#components)
    - [model](#model)
    - [state](#state)
      - [useDataGridState](#usedatagridstate)
  - [MUI Components](#mui-components)

## What is hatchifyjs/react?

@hatchifyjs/react is a model-driven library of components for your hatchify app. By defining the schemas (AKA models) of your backend resources, @hatchifyjs/react will provide you with a set of components that you can use across your React app.

### TypeScript

hatchifyjs/react provides TypeScript support. Here's an example of how two schemas (`Todo` and `User`) provide auto-completion for an instantiated hatchifyjs/react app (`hatchedReact`):![react TypeScript](doc/attachments/reactTs.gif)

todo - add correct gif

## Types

There are a number of types available to assist with app customization.

- DataGridState
- CreateType
- UpdateType
- HatchifyApp
- RecordType

Learn more about the available types [here](types.md).

## createJsonapiClient

Creates a new JSON:API rest client from the defined schemas. `createJsonapiClient` accepts a base url, and schema set.

```ts
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
```

## HatchifyProvider

This is the provider for Hatchify. It gives the Hatchify components access to the Hatchify state. This must be a parent to the components used in the app.

```tsx
const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Everything />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## hatchifyReact

The `hatchifyReact` function creates the `HatchifyApp` object. Inside of the object you will find `components`, `model`, `state`, and `Everything`. `components`, `model`, and `state`, will be broken down further for each defined schema

### Everything

`Everything` is a default component comprised of a set of tabs (one for each schema) and `DataGrid`s. This is used when the app is generated to quickly see the defined schemas and records.

```tsx
const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Everything />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

### components

A set of components for each of the defined schemas to be used in the app.
Included components:
 `DataGrid`
 `Column`
 `Empty`

Learn more about the available components [here](./components.md).

### model

A set of hooks and promises for each of the defined schemas to be used in the app. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed.

- createOne
- deleteOne
- findAll
- findOne
- updateOne
- useAll
- useCreateOne
- useDeleteOne
- useOne
- useUpdateOne

Learn more about the available hooks and promises [here](model.md).

### state

#### useDataGridState

A hook, `useDataGridState` for each of the defined schemas to be used in the app. This is used under the hood in Hatchify, but is available for use in situations where customization is needed.<br>

Parameters:

| key               | description                                       |
| ----------------- | ------------------------------------------------- |
| `defaultSelected` | optional, used for checkboxes                     |
| `onSelectedChange`| optional, used for checkboxes                     |
| `fields`          | optional, fields to be included. If not <br> defined, all fields from the schema <br> and included relationships will be returned             |
| `include`         | optional, relationships to be included            |
| `defaultPage`     | optional, default paginated page                  |
| `defaultSort`     | optional, default sort direction                  |
| `baseFilter` | optional, a pre filter to be used alongside additional |

```tsx

const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["approvedBy"],
  fields: ["name"]
})

```
Learn more about the return type [here](types.md).

## MUI Components

The Hatchify components can be used separately from the HatchifyApp for customization purposes.

- List
- Pagination
- Filters
- DataGrid

Learn more about the available components [here](components.md).
