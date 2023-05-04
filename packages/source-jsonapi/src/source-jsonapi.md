# json-api

This is the default `data-source`. It is _only_ responsible for the network requests and should return data to the `promise` layer in the expected format.

## getList

```ts
getList(config: SourceConfig, query: QueryList): Promise<{ data: Record[] }>
```

**params**

- config `SourceConfig` - the configuration object for the data source
  - baseUrl `string` - baseURL for the API to fetch data from
  - resource `string` - the API endpoint to append to the baseURL, ie. `articles`
- query `QueryList` - the query object for the API
  - fields `string[]` - the fields to fetch from the API
  - @todo page, sort, fitler

**returns**

- `Promise<{ data: Record[] }>`
  - data `Record[]` - the data returned from the API

## jsonapi

```ts
jsonapi(config: { baseUrl: string }): Source
```

**params**

- config `SourceConfig` - the configuration object for the data source
  - baseUrl `string` - baseURL for the API to fetch data from

**returns**

- `Source` - object containing the data source methods
  - getList `getList`
