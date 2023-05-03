# store

## createStore

Creates a new store object.

```ts
createStores(schemaKeys: string[]): Store
```

**params**

- schemaKeys `string[]` - the keys of the schema to create stores for

**returns**

- `Store` - an array of objects containing data and subscribers for each schema key

## insert

Inserts a new record into the store, and notifies all subscribers of the new data.

```ts
insert(resource: string, data: Record[]): void
```

**params**

- resource `string` - the name of the resource to insert into
- data `Record[]` - the data to insert
