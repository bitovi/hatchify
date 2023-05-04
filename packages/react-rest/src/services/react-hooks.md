# hooks

## useList

```ts
useList(dataSource: Source, resource: string, query: QueryList,): [Record[]]
```

**params**

- dataSource `Source` - the data source to fetch data from
- resource `string` - the resource to fetch from the API, ie. `articles`
- query `QueryList` - the query object for the API
  - fields `string[]` - the fields to fetch from the API
  - @todo page, sort, fitler

**returns**

- `[Record[]]`
  - `Record[]` - the data returned from the API
