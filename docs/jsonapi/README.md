# JSON:API

Hatchify implements [JSON:API 1.1](https://jsonapi.org/format/1.1/). The JSON:API specification leaves some decisions up to the implementor, so this document reviews Hatchify's implementation specifically:

- [Creating](./creating.md)
- [Reading](./reading/README.md)
  - [Filtering](./reading/filtering/README.md)
  - [Paginating](./reading/paginating/README.md)
  - [Sorting](./reading/sorting/README.md)
  - [Relationships](./reading/relationships/README.md)
  - [Sparse Fields](./reading/sparse-fields/README.md)
- [Updating](./updating.md)
- [Deleting](./deleting.md)


## Hatchify's JSON:API Overview

### Reading Lists

To get a list of records, you do something like:

```
GET /api/sales-people?
  filter[name]=Justin
  filter[age][$gt]=41


{

}
```

HatchifyJS supports "MongoDB" style filtering operators (`$gt`) above.


### Reading a single record

### Creating

