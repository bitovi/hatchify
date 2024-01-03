# @hatchifyjs/react types

- [Types](#types)
- [DataGridState](#datagridstate)
- [CreateType](#createtype)
- [UpdateType](#updatetype)
- [HatchifyApp](#hatchifyapp)
- [RecordType](#recordtype)

## Types

Types available for use within your Hatchify App should you need them.

### DataGridState

This is the return type of the `useDataGridState` hook.

//todo add example

### CreateType

//todo prepping some form data, ie: const formData: FlatCreateType<typeof schemas.Todo>

### UpdateType

same as CreateType

### HatchifyApp

//todo
some object with other services on it and you want to type the return of it, ie
const myServices = {
  hatchify: hatchifyReact(...),
  foo: ...,
  bar: ...
}

### RecordType

//todo
these should be typed when using via findAll((records) => and useAll etc.
