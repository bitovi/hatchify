# Learn how to include data

This guide shows how to include data with Hatchify.

- [Including Related Data](#including-related-data)
- [A simple example](#a-simple-example)
- [Nested includes](#nested-includes)

## Including Related Data

Sometimes the data you want to display requires joining of multiple tables.

The parsed results of the `include` query parameter is stored in the `include` property. The value of the `include` property is an array of "relationship paths".

Reference: [JSON:API - Inclusion of Related Resources](https://jsonapi.org/format/1.1/#fetching-includes)

## A simple example

For each todo, we can pull the user:

```curl
GET /api/todos?include=user
```

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
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```

## Nested includes

For each todo, we can pull the user and its manager:

```curl
GET /api/todos?include=user,user.manager
```

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
        "firstName": "John",
        "lastName": "Doe",
        "managerId": "d4942d23-c044-49ba-bdd7-285d97d0e0da"
      }
    },
    {
      "type": "User",
      "id": "d4942d23-c044-49ba-bdd7-285d97d0e0da",
      "attributes": {
        "firstName": "Jane",
        "lastName": "Doe",
        "managerId": null
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```
