# @hatchifyjs/react

- [What is hatchifyjs/react](#what-is-hatchifyjsreact)
  - [TypeScript](#typescript)
  - [Types](#types)
  - [createJsonapiClient](#createjsonapiclient)
  - [hatchifyReact](#hatchifyreact)
    - [Everything](#everything)
    - [components](#components)
    - [model](#model)
    - [state](#state)
      - [useCollectionState](#usecollectionstate)
  - [HatchifyProvider](#hatchifyprovider)
  - [MUI Components](#mui-components)

## What is hatchifyjs/react?

@hatchifyjs/react is a model-driven library of components for your hatchify app. By defining the schemas (AKA models) of your backend resources, @hatchifyjs/react will provide you with a set of components that you can use across your React app.

### TypeScript

hatchifyjs/react provides TypeScript support. Here's an example of how two schemas (`Todo` and `User`) provide auto-completion for an instantiated hatchifyjs/react app (`hatchedReact`):![react TypeScript](doc/attachments/ts.gif)

todo - add correct gif

## Types

There are a number of types available to assist with app customization.

- CreateType
- CollectionState
- FlatCreateType
- FlatUpdateType
- HatchifyApp
- UpdateType
- RecordType

Learn more about the available types [here](types.md).

## createJsonapiClient

//todo add example

## hatchifyReact

The `hatchifyReact` function creates the `HatchifyApp` object. Inside of the object you will find `components`, `model`, `state`, and `Everything`. `components`, `model`, and `state`, will be broken down further for each defined schema

### Everything

`Everything` is a default component comprised of a set of tabs (one for each schema) and `DataGrid`s. This is used when the app is generated to quickly see the defined schemas and records.

//todo add example

### components

A set of components for each of the defined schemas to be used in the app.
Included components:
 `DataGrid`
 `Column`
 `Empty`

Learn more about the available components here. //todo add link

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

#### useCollectionState

A hook, `useCollectionState` for each of the defined schemas to be used in the app. This is used under the hood in Hatchify, but is available for use in situations where customization is needed.<br>
Parameters:<br>
  `defaultSelected`: optional, used for checkboxes<br>
  `onSelectedChange`: optional, used for checkboxes<br>
  `fields`: optional, fields to be included. If not defined, all fields from the schema and included relationships will be returned<br>
  `include`: optional, relationships to be included<br>
  `defaultPage`: optional, default paginated page<br>
  `defaultSort`: optional, default sort direction<br>
  `baseFilter`: optional, a pre filter to be used alongside additional <br>filters

Returned state:<br>
  `data`: records of schema data<br>
  `meta`: an object containing the status of the request<br>
  {<br>
    `error`: error message if in error state<br>
    `isResolved`: false when loading, true otherwise<br>
    `isPending`: true when loading, false otherwise<br>
    `isRejected`: true when error, false otherwise<br>
    `isRevalidating`: true when loading after initial call<br>
    `isStale`: true when loading after initial call<br>
    `isSuccess`: true on success, false otherwise<br>
    `meta`: any meta data for the request<br>
    `status`: "loading", "success", or "error"<br>
  }<br>
  `fields`: an object of fields that are included<br>
  `include`: an array of strings of the included relationships<br>
  `filter`: An array of the applied filters<br>
  `setFilter`:The function used to set the filter<br>
  `page`: The current page of data<br>
  `setPage` The function that sets the current page<br>
  `sort`: The current sort direction<br>
  `setSort`: The function that sets the sort<br>
  `selected`: Current selected rows<br>
  `setSelected`: Function for setting the selected rows<br>
  `finalSchemas`: All schemas in their final state<br>
  `partialSchemas`: All schemas in their partial state<br>
  `schemaName`: The name of the selected schema<br>

//todo add example

## HatchifyProvider

This is the provider for Hatchify. It gives the Hatchify components access to the Hatchify state. This must be a parent to the components used in the app.

//todo add example.

## MUI Components

The Hatchify components can be used separately from the HatchifyApp for customization purposes.

- List
- Pagination
- Filters
- DataGrid

Learn more about the available components [here](components.md).
