# @hatchifyjs/react

`@hatchifyjs/react` is an [NPM](https://www.npmjs.com/package/@hatchifyjs/react) package that takes your schemas and provides:

- React [components](hatchedReact.components.md) to create data grids and navigation
- React [hooks](#model) for interacting with your [JSON:API](https://jsonapi.org/) backend
- TypeScript [types](#types)

**In this Document**

- [Setup and Use](#setup-and-use)
  - [Basic Setup](#basic-setup)
  - [React Components Setup](#react-components-setup)
  - [Customizing the MUI theme](#customizing-the-mui-theme)
- [Exports](#exports)
  - [`createJsonapiClient`](#createjsonapiclient) - Creates a new [JSON:API rest client](#createjsonapiclient) using the defined schemas
  - [`hatchifyReact`](#hatchifyreact) - Constructs a `hatchedReact` app instance with custom components,helper functions, and type definitions
  - [`HatchifyProvider`](#hatchifyprovider) - A component that hosts and provides access to Hatchify-related state
- [`hatchedReact`](#hatchedreact)
  - [`components`](#components)
  - [`state`](#state)
  - [`model`](#model)

## Setup and Use

### Basic Setup

To set up the components and hooks, you first need to:

1. Import [createJsonapiClient] and [hatchifyReact] from `@hatchifyjs/react`
2. Create a `jsonapiClient` with a schema
3. Pass `jsonapiClient` to `hatchifyReact`

This will create a [`hatchedReact`](#hatchedreact) object where you can access hooks and components as follows:

```tsx
import {
  hatchifyReact,
  createJsonapiClient,
} from "@hatchifyjs/react"

const Schemas = {Todo: { ... }}

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas));

hatchedReact.model.Todo.useList
hatchedReact.components.Todo.DataGrid
```

### React Components Setup

Hatchify's components are currently used to:

- Provide a navigation utility to tab through different schemas
- Build filterable, paginated, and sortable grids.

**Accessing Components**

The [`Navigation`](./hatchedReact.Navigation.md) component is "all-schemas" aware and is available directly on [`hatchedReact`](#hatchedreact) as follows:

```js
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))
const Navigation = hatchedReact.Navigation
```

The grid components (ex: [DataGrid](./hatchedReact.components[schemaName].DataGrid.md)) are available on the `.components` for their specific schema type as follows:

```js
const hatchedReact = hatchifyReact(createJsonapiClient("/api", schemas))
hatchedReact.components.Todo.DataGrid
```

**Component Provider Dependencies**

Hatchify uses [MaterialUI](https://mui.com/) for design components. For example, Hatchify's `Navigation` component uses MaterialUI's [`<Tabs>`](https://mui.com/material-ui/react-tabs/) component "under the hood". You must provide these components to Hatchify. The way to do this is by providing your MaterialUI `ThemeProvider`.

Similarly, Hatchify has its own provider - [`HatchifyProvider`](#hatchifyprovider). `HatchifyProvider` provides components specific to the data being displayed. For example, you can swap out globally how you want to display dates (See [`HatchifyProvider`'s documentation](#hatchifyprovider) for more details).

You must provide both a MaterialUI and Hatchify provider for Hatchify's components to work. This is typically done in your application's root. See the example below how to do this:

```ts
import {
  hatchifyReact,
  createJsonapiClient,
  HatchifyProvider,          // Hatchify's provider
} from "@hatchifyjs/react"
import {
  createTheme,
  ThemeProvider
} from "@mui/material"       // Material's provider

import * as Schemas from "../schemas.js"

const hatchedReact = hatchifyReact( createJsonapiClient("/api", Schemas) )

const App: React.FC = () => {

  // MaterialUI's ThemeProvider must be outside the HatchifyProvider:
  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <HATCHIFY.COMPONENTS.HERE/>
      </HatchifyProvider>
    </ThemeProvider>
  )
}

export default App
```

## Customizing the MUI theme

`@hatchifyjs/react` uses [Material-UI](https://material-ui.com/) components under the hood. This means that you can use the MUI components directly in your app. For example, you can use the `ThemeProvider` and `createTheme` from MUI to customize the look and feel of your app.

```tsx
const App: React.FC = () => {
  const todoState = hatchedReact.state.Todo.useDataGridState({
    include: ["user"],
  }) // 👀

  return (
    <ThemeProvider theme={createTheme()}>
      <HatchifyProvider>
        <List {...todoState}>
          <TodoEmptyList>No records to display</TodoEmptyList>
        </List>
      </HatchifyProvider>
    </ThemeProvider>
  )
}
```

## Exports

```ts
import { createJsonapiClient, hatchifyReact, HatchifyProvider } from "@hatchifyjs/react"
```

### createJsonapiClient

`createJsonapiClient(baseUrl: string, schemaMap: Schemas)` is a constructor function that creates a new JSON:API rest client from the defined schemas. It accepts a base url, and schema set. For more documentation see [here](../react-jsonapi/README.md).

```ts
import { createJsonapiClient } from "@hatchifyjs/react"

const schemas = { ... }

const jsonClientInstance = createJsonapiClient("/api", Schemas)
```

**Parameters**
`createJsonapiClient` takes two arguments `baseUrl` and `schemaMap`
`baseUrl` is a `string` that references the base url for the rest client
`schemaMap` is a collection of [Hatchify Schemas](../core/README.md)

**Returns**
Returns a `JSON:API rest client` instance object

### hatchifyReact

`hatchifyReact(createJsonapiClient("/api", Schemas))` is a `Function` that initializes the `HatchifyApp` object from the JSON:API rest client. Inside of the returned object you will find [`components`](./hatchedReact.components.md), [`model`](./hatchedReact.model.md), [`state`](./hatchedReact.state.md), and [`Everything`](./hatchedReact.components.everything.md).

```ts
import { createJsonapiClient, hatchifyReact } from "@hatchifyjs/react"

const schemas = { ... }

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))
```

### HatchifyProvider

`HatchifyProvider` must wrap your application for you to use hatchify components. The `HatchifyProvider` also provides a way to override the default renders for each type of attribute and relationship. This is done by passing an optional `defaultDisplayComponents` object to the provider as a prop. In the example below, rather than rendering the text "true" or "false" for a boolean, all booleans in Hatchify components will render as "✅" or "❌".

```tsx
import { HatchifyProvider, hatchifyReact, createJsonapiClient } from "@hatchifyjs/react"
import { boolean, string } from "@hatchifyjs/core"
import type { PartialSchema } from "@hatchifyjs/core"

const schemas = {
  Todo: {
    name: "Todo",
    attributes: {
      name: string(),
      complete: boolean(),
    },
  },
} satisfies Record<string, PartialSchema>

const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const DataGrid = hatchedReact.components.Todo.DataGrid

function MyCustomBoolean({ value }: { value: boolean }) {
  return value ? "✅" : "❌"
}

function App() {
  return (
    <HatchifyProvider
      defaultDisplayComponents={{
        Boolean: MyCustomBoolean,
      }}
    >
      <DataGrid />
    </HatchifyProvider>
  )
}
```

**Props**

| Name                       | Type                                                                        | Description                                                                                |
| -------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `defaultDisplayComponents` | <a href="#defaultdisplaycomponents">`Partial<DefaultDisplayComponents>`</a> | An object that is keyed by type and contains a component to render the value of that type. |

### [Types](./types.md)

`@hatchifyjs/react` provides a number of [types](./types.md) to assist with app customization.

| Type                                        | Description                                                                                                                                                                                                       |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`DataGridState`](./types.md#datagridstate) | The return type of the [`useDataGridState`](./hatchedReact.state.md#usedatagridstate) hook. Can be used if you are extending the functionality of [`useDataGridState`](./hatchedReact.state.md#usedatagridstate). |
| [`CreateType`](./types.md#createtype)       | This can be used to type data that will be used to create a record for a given schema.                                                                                                                            |
| [`UpdateType`](./types.md#updatetype)       | This can be used to type data that will be used to update a record for a given schema.                                                                                                                            |
| [`HatchifyApp`](./types.md#hatchifyapp)     | The return type of the object that is generated by [`hatchifyReact`](#hatchifyreact).                                                                                                                             |
| [`RecordType`](./types.md#recordtype)       | The type of a record for a given schema.                                                                                                                                                                          |

Learn more about the available types [here](./types.md).

## `hatchedReact`

`hatchedReact` is the instantiated [`HatchifyReact` App](#hatchifyreact) that is returned by the [`hatchifyReact`] constructor function. It provides:

- [components](./hatchedReact.components.md) - a set of components for each of the defined schemas to be used in the app.
- [model](./hatchedReact.model.md) - a set of hooks and promises for each of the defined schemas
- [state](./hatchedReact.state.md) - contains hooks that can be used when customizing components provided by hatchify

The following show some of the methods available given a `Todo` and `User` schema:

### [model](./hatchedReact.model.md)

The [`model`](./hatchedReact.model.md) is a set of hooks and promises for each of the defined schemas. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed.

- [`createOne`](./hatchedReact.model.md#createone)
- [`deleteOne`](./hatchedReact.model.md#deleteone)
- [`findAll`](./hatchedReact.model.md#findall)
- [`findOne`](./hatchedReact.model.md#findone)
- [`updateOne`](./hatchedReact.model.md#updateone)
- [`useAll`](./hatchedReact.model.md#useall)
- [`useCreateOne`](./hatchedReact.model.md#usecreateone)
- [`useDeleteOne`](./hatchedReact.model.md#usedeleteone)
- [`useOne`](./hatchedReact.model.md#useone)
- [`useUpdateOne`](./hatchedReact.model.md#useupdateone)

Learn more about the available hooks and promises [here](hatchedReact.model.md).

### [state](./hatchedReact.state.md)

The `state` is a set of hooks for each of the defined schemas. These get used under the hood in the Hatchify components, but are available for use in situations where customization is needed. The `state` object holds a record of schemas each with their own [`useDataGridState`](./hatchedReact.state.md#usedatagridstate) hook.

```tsx
const todoState = hatchedReact.state.Todo.useDataGridState({
  include: ["approvedBy"],
  fields: ["name"],
})
```

Learn more about the return type [here](types.md).

### [components](./hatchedReact.components.md)

[`hatchifyReact`](#hatchifyreact) provides a set of [`components`](./hatchedReact.components.md) for each of the defined schemas. These components include:

- [`DataGrid`](./hatchedReact.components[schemaName].DataGrid.md)
  - [`DataGrid.Column`](./hatchedReact.components[schemaName].DataGrid.Column.md)
  - [`DataGrid.Empty`](./hatchedReact.components[schemaName].DataGrid.Empty.md)
- [`Filters`](./hatchedReact.components[schemaName].Filters.md)
- [`List`](./hatchedReact.components[schemaName].List.md)
- [`Pagination`](./hatchedReact.components[schemaName].Pagination.md)

Learn more about the available components [here](./hatchedReact.components.md).

```tsx
import {HatchifyProvider} from "@hatchifyjs/react"

// Define Schemas
const schemas = { ...Todo }

// Create the Hatched React App instance
const hatchedReact = hatchifyReact(createJsonapiClient("/api", Schemas))

const TodoDataGrid = hatchedReact.components.Todo.DataGrid

const App() {
  return (
    <HatchifyProvider>
      <TodoDataGrid>
        <TodoDataGrid.Empty>No TodoDataGrid.todos found!</TodoDataGrid.Empty>
        <TodoDataGrid.Column
          label="Actions"
          renderDataValue={() =>
            <button
              onClick={({ record }) => console.log(record)}>
                Log Todo
            </button>
          }
        />
      </TodoDataGrid>
    </ HatchifyProvider>
  )
}
```

## Types

### DefaultDisplayComponents

`DefaultDisplayComponents` is an object that is keyed by type and contains a component to render the value of that type. This is used to override the default renders for each type of attribute and relationship.

| Name           | Type                                                                  | Description                                                  |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ |
| `Boolean`      | `React.ComponentType<{ value: boolean }>`                             | A component that will be used to render boolean values.      |
| `Date`         | `React.ComponentType<{ step?: StringStep \| number, value: string }>` | A component that will be used to render date values.         |
| `Number`       | `React.ComponentType<{ value: number }>`                              | A component that will be used to render number values.       |
| `String`       | `React.ComponentType<{ value: string }>`                              | A component that will be used to render string values.       |
| `Relationship` | `React.ComponentType<{ id: string, label: string, [field]: any }>`    | A component that will be used to render relationship values. |
