# subscribe

## subscribeToList

Subscribes a callback to a list of records in a store.

```ts
subscribeToList(resource: string, onChange: (data: Record[]) => void,): Unsubscribe
```

**params**

- resource `string` - the name of the resource to subscribe to
- onChange `(data: Record[]) => void` - the callback to call when the data for the resource changes

**returns**

- `Unsubscribe` - function to unsubscribe the callback
