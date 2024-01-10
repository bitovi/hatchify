# @hatchifyjs/react

- [What is @hatchifyjs/react](#what-is-hatchifyjsreact)
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

## What is @hatchifyjs/react?

@hatchifyjs/react is a schema-driven library of components and helper methods for a Hatchify + React frontend. By providing the schemas (AKA models) of your backend resources, @hatchifyjs/react returns a set of components and helper functionality that you can use across your React app.

### TypeScript

@hatchifyjs/react includes TypeScript support. Here's an example of how two schemas (`Todo` and `User`) provide auto-completion for an instantiated @hatchifyjs/react app (`hatchedReact`):

![react TypeScript](../../doc/attachments/reactTs.gif)

## Types

There are a number of types available to assist with app customization.

- DataGridState
- CreateType
- UpdateType
- HatchifyApp
- RecordType

Learn more about the available types [here](./types.md).

## createJsonapiClient

`createJsonapiClient` creates a new JSON:API rest client from the defined schemas. It accepts a base url, and schema set. For more documentation see [here](./rest-client.md) 🛑.

```ts
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
```

## HatchifyProvider

`HatchifyProvider` is a component that hosts and provides access to Hatchify-related state. Hatchify components in `HatchifyProvider`'s subtree interact with it to access Hatchify internal state. It must be a parent to any Hatchify components.

```tsx
const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        {/* 👀 */}
        <Everything />
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## hatchifyReact

`hatchifyReact` is a function that initializes the `HatchifyApp` object. Inside of the object you will find `components`, `model`, `state`, and `Everything`. `components`, `model`, and `state`, will be broken down further for each defined schema

### Everything

`Everything` is a default component comprised of a set of tabs (one for each schema) and `DataGrid`s. This is used when the app is generated to quickly see the defined schemas and records.

```tsx
const App: React.FC = () => {
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <Everything /> {/* 👀 */}
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

### components

A set of `components` for each of the defined schemas to be used in the app.
Included components:
`DataGrid`
`Column`
`Empty`

Learn more about the available components [here](./components.md).

### model

The `model` is a set of hooks and promises for each of the defined schemas to be used in the app. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed.

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

`useDataGridState` is a hook for each of the defined schemas to be used in the app. This is used under the hood in Hatchify, but is available for use in situations where customization is needed.<br>

`useDataGridState` takes in one parameter, an object, with the following keys:

| key                | description                                                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| `defaultSelected`  | Optional, used for checkboxes                                                                                                     |
| `onSelectedChange` | Optional, used for checkboxes                                                                                                     |
| `fields`           | Optional, fields to be included. If not <br> defined, all fields from the schema <br> and included relationships will be returned |
| `include`          | Optional, relationships to be included                                                                                            |
| `defaultPage`      | Optional, default paginated page                                                                                                  |
| `defaultSort`      | Optional, default sort direction                                                                                                  |
| `baseFilter`       | Optional, a pre filter to be used alongside additional filters                                                                    |

```tsx
const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["approvedBy"],
  fields: ["name"],
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
