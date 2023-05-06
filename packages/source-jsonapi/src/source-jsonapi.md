# json-api

This is the default `data-source`. It is _only_ responsible for the network requests and should return data to the `promise` layer in the expected format.

## getList

- returns a `promise` that resolves to an `array` of Resource `objects` that represent the data requested.

## jsonapi

- returns a source `object` containing the following methods:
  - `getList`
