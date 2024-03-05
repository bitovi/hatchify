# JSON:API

Hatchify implements [JSON:API 1.1](https://jsonapi.org/format/1.1/). The JSON:API specification leaves some decisions up to the implementor, so this document reviews Hatchify's implementation specifically:

- [Reading Lists](#reading-lists)
  - [Filtering](#filtering)
  - [Paginating](#paginating)
  - [Relationships](#relationships)
  - [Sorting](#sorting)
  - [Sparse Fields](#sparse-fields)
- [Reading a single record](#reading-a-single-record)
- [Creating a record](#creating-a-record)
- [Updating a record](#updating-a-record)
- [Deleting a record](#deleting-a-record)
- [Unsupported features](#unsupported-features)

The following is an overview of HatchifyJS's JSON:API implementation:

## Reading Lists

To get a list of records, you do something like:

```curl
GET /api/sales-people
```

and the response will look like

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "SalesPerson",
      "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
      "attributes": {
        "name": "Justin",
        "dateHired": "2000-01-01"
      }
    },
    {
      "type": "SalesPerson",
      "id": "e38bff50-61dd-40ce-b29c-725cb9a2735f",
      "attributes": {
        "name": "Roye",
        "dateHired": "2020-01-01"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 2
  }
}
```

However thanks to JSON:API the query string is able to filter, paginate, sort, include relationships and sparse fields.

### Filtering

While the JSON:API specs suggests having a [`filter`](https://jsonapi.org/format/#fetching-filtering) query string parameter, they are agnostic about the strategies supported by the server. HatchifyJS supports "MongoDB" style filtering operators below:

<pre>
GET /api/sales-people?
  <a href="./reading/filtering/README.md">filter</a>[name]<a href="./reading/filtering/no-operator.md">=</a>Justin
  filter[name]=<a href="../schema/attribute-types/string.md#api-implications">%00</a>                      <b>// %00 is an encoded null value</b>
  filter[name][<a href="./reading/filtering/%24eq.md">$eq</a>]=Justin
  filter[name][<a href="./reading/filtering/%24ne.md">$ne</a>]=Justin
  filter[name][<a href="./reading/filtering/%24in.md">$in</a>]=Justin&filter[name][$in]=Roye
  filter[name][<a href="./reading/filtering/%24nin.md">$nin</a>]=Justin&filter[name][$nin]=Roye
  filter[name][<a href="./reading/filtering/%24gt.md">$gt</a>]=Roye
  filter[name][<a href="./reading/filtering/%24gte.md">$gte</a>]=Arthur
  filter[name][<a href="./reading/filtering/%24gte.md">$gte</a>]=Arthur
  filter[name][<a href="./reading/filtering/%24lt.md">$lt</a>]=Roye
  filter[name][<a href="./reading/filtering/%24lte.md">$lte</a>]=Roye
  filter[name][<a href="./reading/filtering/%24ilike.md">$ilike</a>]=startsWith%25   <b>// %25 is a % encoded</b>
  filter[name][$ilike]=%25endsWith  
  filter[name][$ilike]=%25contains%25
  filter[name][<a href="./reading/filtering/%24like.md">$like</a>]=startsWithCaseSensitive%25
</pre>

A response of filtered results will look similar to the one below where irrelevant results will be omitted based on the query string parameters:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "SalesPerson",
      "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
      "attributes": {
        "name": "Justin",
        "dateHired": "2000-01-01"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```

[Read more on HatchifyJS's filtering support](./reading/filtering/README.md)

### Paginating

The JSON:API specs allows a [`page`](https://jsonapi.org/format/#fetching-pagination) query string parameter to control pagination but they are agnostic about the strategies supported by the server. HatchifyJS supports a few pagination strategies you can choose from:

<pre>
GET /api/sales-people?
  <a href="./reading/paginating/README.md">page</a>[<a href="./reading/paginating/README.md#offset-and-limit-pagination">limit</a>]=5
  page[<a href="./reading/paginating/README.md#offset-and-limit-pagination">offset</a>]=10
  page[<a href="./reading/paginating/README.md#page-based-pagination">number</a>]=2
  page[<a href="./reading/paginating/README.md#page-based-pagination">size</a>]=20
</pre>

A response of paginated results will look similar to the one below and when the `unpaginatedCount` value is greater than the amount of results it indicates there is more data available than the requested page size:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "SalesPerson",
      "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
      "attributes": {
        "name": "Justin",
        "dateHired": "2000-01-01"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 10
  }
}
```

[Read more on HatchifyJS's paginating support](./reading/paginating/README.md)

### Relationships

One of the JSON:API builtin advantages is to pull in compacted related references:

<pre>
GET /api/sales-people?
  <a href="./reading/relationships/README.md">include</a>=todos,accounts,accounts.owner
</pre>

A response of results with related data will look similar to the one below:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "SalesPerson",
      "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
      "attributes": {
        "name": "Justin",
        "dateHired": "2000-01-01"
      },
      "relationships": {
        "todos": {
          "data": [
            {
              "type": "Todo",
              "id": "d65c0ab4-b61e-4147-97f3-cba1a0a88e03"
            }
          ]
        },
        "accounts": {
          "data": [
            {
              "type": "Account",
              "id": "77667b72-534c-4c22-9b01-7b49158d6015"
            }
          ]
        }
      }
    }
  ],
  "included": [
    {
      "type": "Todo",
      "id": "d65c0ab4-b61e-4147-97f3-cba1a0a88e03",
      "attributes": {
        "name": "Cleanup"
      }
    },
    {
      "type": "Account",
      "id": "77667b72-534c-4c22-9b01-7b49158d6015",
      "attributes": {
        "name": "Acme"
      },
      "relationships": {
        "owner": {
          "data": {
            "type": "User",
            "id": "77667b72-534c-4c22-9b01-7b49158d6015"
          }
        }
      }
    },
    {
      "type": "User",
      "id": "77667b72-534c-4c22-9b01-7b49158d6015",
      "attributes": {
        "name": "Justin"
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```

[Read more on HatchifyJS's relationship support](./reading/relationships/README.md)

### Sorting

The JSON:API specs have detailed guidelines how to implement the [`sort`](https://jsonapi.org/format/#fetching-sorting) query string parameter. HatchifyJS implements these with added support for sorting relationships as well:

<pre>
GET /api/sales-people?
  include=salesGroup
  <a href="./reading/sorting/README.md">sort</a>=-importance,salesGroup.name
</pre>

[Read more on HatchifyJS's sorting support](./reading/sorting/README.md)

### Sparse Fields

The JSON:API specs have detailed guidelines how to implement the [`fields`](https://jsonapi.org/format/#fetching-sparse-fieldsets) query string parameter. HatchifyJS implements it with a slight difference in casing of the schemas:

<pre>
GET /api/sales-people?
  <a href="./reading/sparse-fields/README.md">fields</a>[SalesPerson]=name
  fields[<a href="./reading/sparse-fields/README.md#example-with-relationships">Todo</a>]=name,importance
</pre>

A response with sparse fields will look similar to we we had above but only specified fields will be returned:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": [
    {
      "type": "SalesPerson",
      "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
      "attributes": {
        "name": "Justin"
      },
      "relationships": {
        "todos": {
          "data": [
            {
              "type": "Todo",
              "id": "d65c0ab4-b61e-4147-97f3-cba1a0a88e03"
            }
          ]
        }
      }
    }
  ],
  "included": [
    {
      "type": "Todo",
      "id": "d65c0ab4-b61e-4147-97f3-cba1a0a88e03",
      "attributes": {
        "name": "Cleanup",
        "importance": 7
      }
    }
  ],
  "meta": {
    "unpaginatedCount": 1
  }
}
```

[Read more on HatchifyJS's sparse fields support](./reading/sparse-fields/README.md)

## Reading a single record

When you know the ID of the record you are looking for, you can fetch it like:

```curl
GET /api/sales-people/ffaf131e-9e27-4bd6-a715-59fff9ed5044
```

And get a response that looks like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "SalesPerson",
    "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
    "attributes": {
      "name": "Justin",
      "dateHired": "2000-01-01"
    }
  }
}
```

[Relationships](#relationships) and [sparse fields](#sparse-fields) from above are also supported when reading a single record.

## Creating a record

The JSON:API specs allows [creation](https://jsonapi.org/format/#crud-creating) of a new resource and attaching it to pre-existing IDs in the same request:

```curl
POST /api/sales-people
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "SalesPerson",
    "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
    "attributes": {
      "name": "Justin",
      "dateHired": "2000-01-01"
    },
    "relationships": {
      "todos": {
        "data": [
          {
            "type": "Todo",
            "id": "d65c0ab4-b61e-4147-97f3-cba1a0a88e03"
          }
        ]
      }
    }
  }
}
```

[Read more on HatchifyJS's creating](./creating.md)

## Updating a record

The JSON:API specs allows [update](https://jsonapi.org/format/#crud-updating) of an existing resource and attaching it to pre-existing IDs in the same request:

```curl
PATCH /api/sales-people/ffaf131e-9e27-4bd6-a715-59fff9ed5044
```

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "SalesPerson",
    "id": "ffaf131e-9e27-4bd6-a715-59fff9ed5044",
    "attributes": {
      "dateHired": "2020-01-01"
    },
    "relationships": {
      "todos": {
        "data": [
          {
            "type": "Todo",
            "id": "0f6fc95d-622e-43cc-9a44-0b7ef7793be3"
          }
        ]
      }
    }
  }
}
```

[Read more on HatchifyJS's updating](./updating.md)

## Deleting a record

The JSON:API specs allows [deletion](https://jsonapi.org/format/#crud-deleting) of an existing resource by its ID:

```curl
DELETE /api/sales-people/ffaf131e-9e27-4bd6-a715-59fff9ed5044
```

[Read more on HatchifyJS's deleting](./deleting.md)

## Unsupported features

- `/relationships` endpoints. Currently we have to [update the record](#updating-a-record) to update its relationships.
