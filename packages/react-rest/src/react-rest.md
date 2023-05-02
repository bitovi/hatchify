# react

## reactRest

```ts
reactRest(reactSchemas: ReactSchemas): ReactRest
```

**params**

- reactSchemas `{ [key: string]: ReactSchema }` - the schemas that reactRest should generate stores and actions for

**returns**

- `ReactRest`
  - `getList` - Promise function that fetches a list of records from the API
  - `useList` - React hook that returns a list of records from the store, fetches new data from the API, and subscribes to changes in the store
  - `subscribeToList` - Function that subscribes a callback to a list of records in the store and returns an unsubscribe function
