# @hatchifyjs/react components

@hatchifyjs/react has several components available to use in your React app. There are two sets of components to be used.

The hatchifyReact Components are included in the HatchifyApp, and have access to the state from the provider.

The Material UI components are intended for use in instances when customization is needed. These require ejecting the Hatchify state from the HatchifyApp and manually passed back in as a prop.

- [hatchifyReact Components](#hatchifyreact-components)
  - [DataGrid](#hatchify-datagrid)
  - [Column](#hatchify-column)
  - [Empty](#hatchify-empty)
- [Material UI components](#material-ui-components)
  - [List](#list)
  - [Pagination](#pagination)
  - [Filters](#filters)
  - [DataGrid](#datagrid)

## hatchifyReact Components

### Hatchify DataGrid

Similar to the MUI DataGrid, this displays the records of a specific schema, but the state does not have to be passed in.

//todo add example.

### Hatchify Column

The Column component is used anytime there is a need to customize the output of a specific column. This can be used as a child of both the Hatchify `DataGrid` and the MUI `DataGrid`.

//todo add example.

### Hatchify Empty

This component is used to customize what is displayed when the Hatchify `DataGrid` has no records to display.

//todo add example.

## Material UI Components

@hatchifyjs/react provides access to the components directly separate from the Hatchify state layer. You can use this approach when needing to customize how the state of the records are displayed.

### List

Used for displaying rows of records.

//todo add example of List component.

### Pagination

Used for paginating data in the table.

//todo add example.

### Filters

Used for filtering data in the table.

//todo add example.

### DataGrid

Used for displaying records. This component is comprised of `Filters`, `List`, and `Pagination`

//todo add example.
