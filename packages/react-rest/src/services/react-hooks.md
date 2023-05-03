# hooks

## useList

```ts
useList(dataSource: DataSource, resource: string, query: QueryList,): [Record[]]
```

**params**

- dataSource `DataSource` - the data source to fetch data from
- resource `string` - the resource to fetch from the API, ie. `articles`
- query `QueryList` - the query object for the API
  - fields `string[]` - the fields to fetch from the API
  - @todo page, sort, fitler

**returns**

- `[Record[]]`
  - `Record[]` - the data returned from the API

## useCreateOne

```ts
useCreateOne(dataSource: DataSource, resource: string): [createOneFunction, createOneMeta, createdRecord]
```

**params**

- dataSource `DataSource` - the data source to fetch data from
- resource `string` - the resource to fetch from the API, ie. `articles`

**returns**

- `[createOneFunction, createOneMeta, createdRecord]`
  - `createOneFunction` - function to create a record
  - `createOneMeta` - meta data from the createOne request
  - `createdRecord` - the record that was created
