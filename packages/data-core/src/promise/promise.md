# promises

## getList

Fetches a list of records from the API, returns a `Promise`, and notifies all subscribers of the new data.

```ts
getList(dataSource: DataSource, resource: string, query: QueryList,): Promise<Record[]>
```

**params**

- dataSource `DataSource` - the data source object
- resource `string` - the resource to fetch from the API, ie. `articles`
- query `QueryList` - the query object for the API
  - fields `string[]` - the fields to fetch from the API
  - @todo page, sort, fitler

**returns**

- `Promise<Record[]>`
  - `Record[]` - the data returned from the API
