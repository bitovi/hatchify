# @hatchifyjs/react

@hatchifyjs/react is a schema-driven library of components and helper methods for a Hatchify + React frontend. By providing the schemas (AKA models) of your backend resources, @hatchifyjs/react returns a set of components and helper functionality that you can use across your React app.

`@hatchifyjs/react` is a TypeScript supported [NPM package](https://www.npmjs.com/package/@hatchifyjs/react) that takes your [JSON:API rest client](#createjsonapiclient) and[Schema(s)](../schema/README.md) to produce custom:

- components
- helper functions
- generated [types](#types)

The following uses `hatchifyReact`to create a `hatchedReact` app with the defined `Todo` and `User` schemas.

```tsx
import { hatchifyReact, HatchifyProvider, createJsonapiClient } from "@hatchifyjs/react"

// Define your Schema(s)
export const Schemas = {
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
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

// Define variables for your Hatchify schema generated components
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

// Render your React Functional Component
const HatchedComponent = () => {
  return (
    <HatchifyProvider>
      <button onClick={onActionClick} style={{ margin: 10 }}>
        action
      </button>
      <TodoDataGrid defaultSort={{ direction: "asc", sortBy: "id" }}></TodoDataGrid>
    </HatchifyProvider>
  )
}

export default App
```

[!IMPORTANT]
The `HatchifyProvider` wraps all Hatchify components to manage their internal states. See [HatchifyProvider](#hatchifyprovider) for more information.

- [Exports](#exports)
  - [createJsonapiClient](#createjsonapiclient)
  - [HatchifyProvider](#hatchifyprovider)
  - [hatchifyReact](#hatchifyreact)
  - [Types](#types)
    - [DataGridState](#usedatagridstate)
    - [CreateType](#usedatagridstate)
    - [UpdateType](#usedatagridstate)
    - [HatchifyApp](#usedatagridstate)
    - [RecordType](#usedatagridstate)
- [`hatchedReact`](#hatchedreact)
  - [`hatchedReact.Everything`](#everything)
  - [`hatchedReact.components`](#components)
  - [`hatchedReact.model`](#model)
  - [`hatchedReact.state`](#state)
    - [useDataGridState](#usedatagridstate)
- [MUI Components](#mui-components)

- [Exports](#exports)
  - createJsonapiClient - Creates a new [JSON:API rest client](#createjsonapiclient) using the defined schemas
  - hatchifyReact - Constructs a `hatchedReact` app instance with custom components,helper functions, and type definitions
  - HatchifyProvider - A component that hosts and provides access to Hatchify-related state
- [`hatchedReact`](#hatchedreact)
  - [`hatchedReact.Everything`](#everything)
  - [`hatchedReact.components`](#components)
  - [`hatchedReact.state`](#state)
  - [`hatchedReact.model`](#model)

## Exports

```ts
import { createJsonapiClient, hatchifyReact, HatchifyProvider } from "@hatchifyjs/react"
```

### createJsonapiClient

`createJsonapiClient(baseUrl: string, schemaMap: Schemas)` is a constructor function that creates a new JSON:API rest client from the defined schemas. It accepts a base url, and schema set. For more documentation see [here](./rest-client.md) 🛑.

```ts
import {createJsonapiClient} from "@hatchifyjs/react"

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
import {createJsonapiClient, hatchifyReact} from "@hatchifyjs/react"

const schemas = { ... }

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
```

### HatchifyProvider

`HatchifyProvider` is a component that hosts and provides access to Hatchify-related state. It must be a parent to any Hatchify components.

```tsx
import {HatchifyProvider} from "@hatchifyjs/react"

// Define Schemas

const schemas = { ... }

// Create the Hatched React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

// Define variables for your Hatchify schema generated components
const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const HatchedComponent = () => {
  return (
    <HatchifyProvider>
      <TodoDataGrid defaultSort={{ direction: "asc" }} />
    </HatchifyProvider>
  )
}
```

### Types

`@hatchifyjs/react` provides a number of [types](./types.md) to assist with app customization.

| key                                         | description                                                                             |
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

A set of `components` for each of the defined schemas to be used in the app.
Included components:
`DataGrid`
`Column`
`Empty`

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
const HatchedComponent = () => {
  return (
    <HatchifyProvider>
      <TodoEmpty />
      <TodoDataGrid>
        <TodoColumn />
      </TodoDataGrid>
      <TodoEmpty />
    </HatchifyProvider>
  )
}
```

### model

The `model` is a set of hooks and promises for each of the defined schemas. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed.

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

The `state` is a set of hooks for each of the defined schemas to be used in the app. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed. The `state` object holds a record of schemas each with their own [`useDataGridState`](./state.md#usedatagridstate) hook.

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
