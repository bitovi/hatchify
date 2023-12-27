# Learn how to sparse fieldsets

This guide shows how to sparse fieldset with Hatchify.

- [Why do we need to sparse Fieldsets](#why-do-we-need-to-sparse-fieldsets)
- [A simple example](#a-simple-example)
- [Example with Relationships](#example-with-relationships)

## Why do we need to sparse Fieldsets

It is pretty common that a schema has more attributes than what we wish to show on the UI. By default, Hatchify pulls all attributes of included schemas. Sparse fieldsets allows us to specify which attributes we care about for a specific query, so we can keep response size smaller and faster.

The parsed results of the `fields[TYPE]` query parameters are stored in the `fields` property. The value of the `fields` property is an object. For each key-value pair in that object, the key is the name of a type and the value is an array of attributes for that type.

Reference: [JSON:API - Sparse Fieldsets](https://jsonapi.org/format/#fetching-sparse-fieldsets)

## A simple example

A simple example of fetching only the `name` attribute for all todos:

```curl
GET /api/todos?fields[Todo]=name
```

will return something like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Todo",
      "id": "e0cb51e1-72ff-40b9-9844-1eb36c8e5f66",
      "attributes": {
        "name": "Walking"
      }
    },
    {
      "type": "Todo",
      "id": "56f156f2-ec87-47ce-86f3-422974b36e25",
      "attributes": {
        "name": "Running"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 2
  }
}
```

## Example with Relationships

When including relationships, it is even more common that there are fields we do not want to show:

```curl
GET /api/todos?include=user&fields[Todo]=name,userId&fields[User]=lastName
```

will return something like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Todo",
      "id": "e0cb51e1-72ff-40b9-9844-1eb36c8e5f66",
      "attributes": {
        "name": "Walking",
        "userId": "276a11ad-7c16-41d7-9c88-5b3969629565"
      }
    }
  ],
  "included": [
    {
      "type": "User",
      "id": "276a11ad-7c16-41d7-9c88-5b3969629565",
      "attributes": {
        "lastName": "Doe"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```
