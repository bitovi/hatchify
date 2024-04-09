# Sparse Fields

This guide reviews how to use "sparse fieldsets" with Hatchify.

- [Why do we need Sparse Fieldsets](#why-do-we-need-sparse-fieldsets)
- [Specification](#specification)
- [A simple example](#a-simple-example)
- [Example with Relationships](#example-with-relationships)

## Why do we need Sparse Fieldsets

It's common that a schema has more attributes than we wish to display on the UI. By default, Hatchify fetches and displays all attributes of included schemas. Sparse fieldsets allows us to specify which attributes we care about for a specific query, so we can keep response size smaller and faster.

## Specification

The querystring of a request can include multiple parameters of the form `fields[Type]=fieldName`. All parameters of that form are collected and parsed into an object like:

```json
"fields": {
  "type": ["fieldName"],
  "todo": ["label", "complete"],
  "user": ["name", "age"]
}
```

When these types are queried and serialized into the response, only the corresponding "sparse" set of fields will be retrieved.

Reference: [JSON:API - Sparse Fieldsets](https://jsonapi.org/format/1.1/#fetching-sparse-fieldsets)

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
