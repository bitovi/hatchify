# Learn how to sort data

This guide shows how to sort data with Hatchify.

- [How does sorting work](#how-does-sorting-work)
- [Ascending Order](#ascending-order)
- [Descending Order](#descending-order)
- [Multi-column order](#multi-column-order)
- [Sorting included data](#sorting-included-data)

## How does sorting work

As data grows, pagination and sorting on the backend becomes more important.

The parsed results of the `sort` query parameters are stored in the `sort` property.
The value of the `sort` property is an array of "sort field" objects. Each "sort field" object includes a field name and a sort direction.

Reference: [JSON:API - Sorting](https://jsonapi.org/format/1.1/#fetching-sorting)

## Ascending order

In order to sort todos by importance ascending:

```curl
GET /api/todos?sort=importance
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Todo",
      "id": "4ad671b2-5d55-4a17-bb12-22180424ef6d",
      "attributes": {
        "name": "Cooking",
        "importance": 1
      }
    },
    {
      "type": "Todo",
      "id": "bb003a26-168e-4e9f-afee-0ea809340217",
      "attributes": {
        "name": "Walking",
        "importance": 1
      }
    },
    {
      "type": "Todo",
      "id": "1b567725-cf88-43a7-8dad-c3fd9bbabfe2",
      "attributes": {
        "name": "Running",
        "importance": 2
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 3
  }
}
```

## Descending order

In order to sort todos by importance descending we add a minus sign:

```curl
GET /api/todos?sort=-importance
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Todo",
      "id": "1b567725-cf88-43a7-8dad-c3fd9bbabfe2",
      "attributes": {
        "name": "Running",
        "importance": 2
      }
    },
    {
      "type": "Todo",
      "id": "bb003a26-168e-4e9f-afee-0ea809340217",
      "attributes": {
        "name": "Walking",
        "importance": 1
      }
    },
    {
      "type": "Todo",
      "id": "4ad671b2-5d55-4a17-bb12-22180424ef6d",
      "attributes": {
        "name": "Cooking",
        "importance": 1
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 3
  }
}
```

## Multi-column order

In order to sort todos by importance descending and then name ascending we use a comma:

```curl
GET /api/todos?sort=-importance,name
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Todo",
      "id": "1b567725-cf88-43a7-8dad-c3fd9bbabfe2",
      "attributes": {
        "name": "Running",
        "importance": 2
      }
    },
    {
      "type": "Todo",
      "id": "4ad671b2-5d55-4a17-bb12-22180424ef6d",
      "attributes": {
        "name": "Cooking",
        "importance": 1
      }
    },
    {
      "type": "Todo",
      "id": "bb003a26-168e-4e9f-afee-0ea809340217",
      "attributes": {
        "name": "Walking",
        "importance": 1
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 3
  }
}
```

## Sorting included data

In order to sort todos by importance descending and then user last name ascending we use a dot:

```curl
GET /api/todos?include=user&sort=-importance,user.lastName
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "Todo",
      "id": "1b567725-cf88-43a7-8dad-c3fd9bbabfe2",
      "attributes": {
        "importance": 2,
        "userId": "87729c17-792d-414f-b8e0-63df173f579e"
      }
    },
    {
      "type": "Todo",
      "id": "4ad671b2-5d55-4a17-bb12-22180424ef6d",
      "attributes": {
        "importance": 1,
        "userId": "87729c17-792d-414f-b8e0-63df173f579e"
      }
    },
    {
      "type": "Todo",
      "id": "bb003a26-168e-4e9f-afee-0ea809340217",
      "attributes": {
        "importance": 1,
        "userId": "ad36731e-2747-4eaa-b5c0-5a73da26e72f"
      }
    }
  ],
  "included": [
    {
      "type": "User",
      "id": "87729c17-792d-414f-b8e0-63df173f579e",
      "attributes": {
        "lastName": "Boe"
      }
    },
    {
      "type": "User",
      "id": "ad36731e-2747-4eaa-b5c0-5a73da26e72f",
      "attributes": {
        "lastName": "Doe"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 3
  }
}
```
