# @hatchifyjs/react

@hatchifyjs/react is an [NPM](<(https://www.npmjs.com/package/@hatchifyjs/react)>) package that takes your schemas and provides:

- React Components
- CRUD promise functions and react hooks
- TypeScript

for interacting with your [JSON:API](https://jsonapi.org/) backend.

The following uses `hatchifyReact` to create a `hatchedReact` app with the defined `Todo` and `User` schemas.

```tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"

export const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      status: enumerate({ values: ["Pending", "Failed", "Completed"] }),
    },
    relationships: {
      user: belongsTo("User"),
    },
  },
  User: {
    name: "User",
    attributes: {
      name: string(),
    },
    relationships: {
      todos: hasMany(),
    },
  },
} satisfies Record<string, PartialSchema>

// Create your Hatched React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))

// Grab the Todo DataGrid component from the hatchedReact object
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App() {
  return (
    <HatchifyProvider>
      <TodoDataGrid />
    </HatchifyProvider>
  )
}

export default App
```

[!IMPORTANT]
You must wrap your App in a [`HatchifyProvider`](#hatchifyprovider) so that you may use the components provided by [Hatchify](../../README.md).

- [Exports](#exports)
  - [`createJsonapiClient`](#createjsonapiclient) - Creates a new [JSON:API rest client](#createjsonapiclient) using the defined schemas
  - [`hatchifyReact`](#hatchifyreact) - Constructs a `hatchedReact` app instance with custom components,helper functions, and type definitions
  - [`HatchifyProvider`](#hatchifyprovider) - A component that hosts and provides access to Hatchify-related state
- [`hatchedReact`](#hatchedreact)
  - [`hatchedReact.Everything`](#everything)
  - [`hatchedReact.components`](#components)
  - [`hatchedReact.state`](#state)
  - [`hatchedReact.model`](#model)
- [MUI Components](#mui-components)

## Exports

```ts
import { createJsonapiClient, hatchifyReact, HatchifyProvider } from "@hatchifyjs/react"
```

### createJsonapiClient

`createJsonapiClient(baseUrl: string, schemaMap: Schemas)` is a constructor function that creates a new JSON:API rest client from the defined schemas. It accepts a base url, and schema set. For more documentation see [here](./rest-client.md) 🛑.

```ts
import { createJsonapiClient } from "@hatchifyjs/react"

const schemas = { ... }

const jsonClientInstance = createJsonapiClient("/api", Schemas)
```

**Parameters**
`createJsonapiClient` takes two arguments `baseUrl` and `schemaMap`
`baseUrl` is a `string` that references the base url for the rest client
`schemaMap` is a collectionn of [Hatchify Schemas](../schema/README.md)

**Returns**

Returns a `JSON:API rest client` instance object

### hatchifyReact

`hatchifyReact(createJsonapiClient("/api", Schemas))` is a `Function` that initializes the `HatchifyApp` object from the JSON:API rest client. Inside of the retured object you will find [`components`](./components.md), [`model`](./model.md), [`state`](./state.md), and [`Everything`](#everything).

```ts
import { createJsonapiClient, hatchifyReact } from "@hatchifyjs/react"

const schemas = { ... }

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
```

### HatchifyProvider

`HatchifyProvider` gives your App access to use the components provided by Hatchify.

```tsx
import {HatchifyProvider} from "@hatchifyjs/react"

// Define Schemas
const schemas = { ... }

// Create the Hatched React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

// Define variables for your Hatchify schema generated components
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App() {
  return (
    <HatchifyProvider>
      <TodoDataGrid defaultSort={{ direction: "asc" }} />
    </HatchifyProvider>
  )
}
```

### Types

`@hatchifyjs/react` provides a number of [types](./types.md) to assist with app customization.

| Type                                        | Description                                                                             |
| ------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`DataGridState`](./types.md#datagridstate) | The return type of the `useDataGridState` hook.                                         |
| [`CreateType`](./types.md#createtype)       | The type used when data is created.                                                     |
| [`UpdateType`](./types.md#updatetype)       | Is the type used when data is updated.                                                  |
| [`HatchifyApp`](./types.md#hatchifyapp)     | the type of the Hatchify App that is generated with [`hatchifyReact()`](#hatchifyreact) |
| [`RecordType`](./types.md#recordtype)       | Matches a record's schema                                                               |

Learn more about the available types [here](./types.md).

## `hatchedReact`

`hatchedReact` is the instantiated [`HatchifyReact` App](#hatchifyreact) that is returned by the [`hatchifyReact`] constructor function. It provides:

- [Everything](./Everything.md) - is a default component comprised of a set of tabs 🛑 (one for each schema) and DataGrids.
- [components](./components.md) - a set of components for each of the defined schemas to be used in the app.
- [model](./model.md) - a set of hooks and promises for each of the defined schemas
- [state](./state.md) - a set of hooks for each of the defined schemas to be used in the app.

The following show some of the methods available given a `Todo` and `User` schema:

### Everything

`Everything` is a default component comprised of a set of tabs (one for each schema) and `DataGrid`s. This is used when the app is generated to swiftly validate the defined schemas and records.

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

[`hatchifyReact`](#hatchifyreact) provides a set of [`components`](./components.md) for each of the defined schemas. These components include:

[`DataGrid`](./components.md#datagrid)
[`List`](./components.md#list)
[`Filters`](./components.md#filters)
[`Pagination`](./components.md#pagination)
[`Column`](./components.md#column)
[`Empty`](./components.md#empty)

Learn more about the available components [here](./components.md).

```tsx
import {HatchifyProvider} from "@hatchifyjs/react"

// Define Schemas
const schemas = { ...Todo }

// Create the Hatched React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

// Define variables for your Hatchify schema generated components
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const TodoColumn = hatchedReact.components.Todo.Column

const TodoEmpty = hatchedReact.components.Todo.Empty

// Render your custom component
const App() {
  return (
    <HatchifyProvider>
      <TodoDataGrid>
        <TodoEmpty>No todos found!</TodoEmpty>
        <TodoColumn
          label="Actions"
          renderDataValue={() => <button onClick={({ record }) => console.log(record)}>Log Todo</button>
        />
      </ TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

### model

The [`model`](./model.md) is a set of hooks and promises for each of the defined schemas. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed.

- [`createOne`](./model.md#createone)
- [`deleteOne`](./model.md#deleteone)
- [`findAll`](./model.md#findall)
- [`findOne`](./model.md#findone)
- [`updateOne`](./model.md#updateone)
- [`useAll`](./model.md#useall)
- [`useCreateOne`](./model.md#usecreateone)
- [`useDeleteOne`](./model.md#usedeleteone)
- [`useOne`](./model.md#useone)
- [`useUpdateOne`](./model.md#useupdateone)

Learn more about the available hooks and promises [here](model.md).

### state

The `state` is a set of hooks for each of the defined schemas to be used in the app. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed. The `state` object holds a record of schemas each with their own [`useDataGridState`](./state.md#usedatagridstate) hook.

```tsx
const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["approvedBy"],
  fields: ["name"],
})
```

Learn more about the return type [here](types.md).
