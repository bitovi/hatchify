# Customizing schema, table, relationship, and service API naming

## Guidelines

- Model names should be singular and use `PascalCase`
  - `as` should be used for all relationships with a `camelCase` names to be implicit and to override `Sequelize`'s default. This value is used for customizing the relationship name and will help determining the column name in the database.
  - `foreignKey` can be used
- Table names should be singular and use `snake_case`. Databases like Postgres requires wrapping all non-lower case table and field names with double quotes.
- URLs should be singular or plural depends on relationships and use `kebab-case` for the path but `camelCase` for model names and includes: `/sales-persons?fields[salesPerson]=name&include=customerData`
- Request payloads and response bodies should be singular or plural depends on relationships and use:
  - `PascalCase` for model names
  - `camelCase` for relationships
- Hatchify backend as well as [Sequelize](https://www.npmjs.com/package/sequelize) are using [Inflection](https://www.npmjs.com/package/inflection) for pluralization of names. It takes care of irregular nouns for us.

## Examples

### Base Example

Given a pre-existing model

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{ target: "SalesPerson" }],
}
```

A name like `SalesPerson` in the schema:

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
}
```

The server will already have the following endpoints for accounts:

1. `GET /api/accounts?fields[account]=name&filter[name]=Bitovi`
1. `GET /api/accounts/:id`
1. `PATCH /api/accounts/:id`
1. `DELETE /api/accounts/:id`

And the following endpoints for sales persons:

1. `GET /api/sales-persons?fields[salesPerson]=name&filter[name]=John+Doe` (appending `s` regardless of the model name)
1. `GET /api/sales-persons/:id`
1. `PATCH /api/sales-persons/:id`
1. `DELETE /api/sales-persons/:id`

Other than that, it also:

1. Creates a table `sales_person` with the columns `id` and `first_name` and a table `account` with the columns `id`, `name` and `sales_person_id`.
1. Once we define relationship to `SalesPerson` they will be named `salesPerson` or `salesPersons`.
1. Returns `JSONAPI` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "SalesPerson",
    "id": "11-22",
    "attributes": {
      "firstName": "John"
    }
  }
}
```

### Changing Pluralization

Setting `pluralName` for `SalesPerson`:

```js
const SalesPerson = {
  name: "SalesPerson",
  pluralName: "SalesPeople"
  attributes: {
    firstName: "STRING",
  },
}
```

1. Creates a service layer `sales-people`.
1. Creates relationships as `salesPerson` or `salesPeople` (`snakeCase` of `name` or `pluralName`).

### Relationships

Other than the required `target` field, you can leverage `as` to set the relationship name for service layer, URLs and database, or any of the below to control the naming in the database layer:

- `foreignKey` to set the name of the foreign key. By default it is `${model}Id`
- `sourceKey` to set the other table's foreign key column name for `hasOne` and `hasMany`
- `targetKey` to set the other table's foreign key column name for `belongsTo`
- `otherKey` to set the other table's foreign key column name for `belongsToMany`
- `through` is used for `belongsToMany` to control the name of the junction table

For more information, refer to the [Sequelize Docs](https://sequelize.org/docs/v6/core-concepts/assocs/)

### For `BelongsTo` relationships …

only `as` is used:

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{ target: "SalesPerson", options: { as: "closerPerson" } }],
}
```

1. Creates a table `account` with the columns `id`, `name` and `closer_person_id`.
1. Creates relationships as `closerPerson`.
1. Returns `JSONAPI` from `GET /account/1?include=closerPerson` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "Account",
    "id": "12-22",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "closerPerson": {
        "data": {
          "type": "SalesPerson",
          "id": "332-222"
        }
      }
    },
    "included": [
      {
        "type": "SalesPerson",
        "id": "332-222",
        "attributes": {
          "firstName": "John"
        }
      }
    ]
  }
}
```

only `as` and `foreignKey` are used:

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{ target: "SalesPerson", options: { as: "closer", foreignKey: "finisher_id" } }],
}
```

1. Creates a table `sales_person` with the columns `id` and `first_name` and a table `account` with the columns `id`, `name` and `finisher_id`.
1. Creates relationships as `closerPerson`.
1. Returns `JSONAPI` from `GET /account/1?include=closer` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "Account",
    "id": "12-22",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "closer": {
        "data": {
          "type": "SalesPerson",
          "id": "332-222"
        }
      }
    },
    "included": [
      {
        "type": "SalesPerson",
        "id": "332-222",
        "attributes": {
          "firstName": "John"
        }
      }
    ]
  }
}
```

### For `HasMany` relationships …

only `as` is used:

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  hasMany: [{ target: "SalesPerson", options: { as: "managers" } }],
}
```

1. Creates a table `sales_person` with the columns `id`, `first_name` and `account_id`, and a table `account` with the columns `id` and `name`.
1. Creates relationships as `managers`.
1. Returns `JSONAPI` from `GET /account/1?include=managers` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "Account",
    "id": "12-22",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "managers": [
        {
          "data": {
            "type": "SalesPerson",
            "id": "332-222"
          }
        }
      ]
    },
    "included": [
      {
        "type": "SalesPerson",
        "id": "332-222",
        "attributes": {
          "firstName": "John"
        }
      }
    ]
  }
}
```

only `as` and `foreignKey` are used:

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  hasMany: [{ target: "SalesPerson", options: { as: "closer", foreignKey: "finisher_id" } }],
}
```

1. Creates a table `sales_person` with the columns `id` and `first_name` and a table `account` with the columns `id`, `name` and `finisher_id`.
1. Creates relationships as `closerPerson`.
1. Returns `JSONAPI` from `GET /account/1?include=closer` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "Account",
    "id": "12-22",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "closer": {
        "data": {
          "type": "SalesPerson",
          "id": "332-222"
        }
      }
    },
    "included": [
      {
        "type": "SalesPerson",
        "id": "332-222",
        "attributes": {
          "firstName": "John"
        }
      }
    ]
  }
}
```

### For `BelongsToMany` relationships …

only `as` and `through` are used:

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account",
      options: {
        as: "accounts",
        through: "AccountSalesPerson",
      },
    },
  ],
}

const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsToMany: [
    {
      target: "SalesPerson",
      options: {
        as: "participants",
        through: "AccountSalesPerson",
      },
    },
  ],
}
```

1. Creates a table `sales_person` with the columns `id`, `first_name` and a table `account` with the columns `id` and `name` and a junction table with the columns `sales_person_id` and `account_id`.
1. Creates relationships as `accounts` and `participants`.
1. Returns `JSONAPI` from `GET /account/1?include=participants` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "Account",
    "id": "12-22",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "participants": [
        {
          "data": {
            "type": "SalesPerson",
            "id": "332-222"
          }
        }
      ]
    },
    "included": [
      {
        "type": "SalesPerson",
        "id": "332-222",
        "attributes": {
          "firstName": "John"
        }
      }
    ]
  }
}
```

`as`, `through`, `foreignKey` and `otherKey` are used:

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account",
      options: {
        as: "accounts",
        through: "AccountSalesPerson",
        foreignKey: "participant_id",
        otherKey: "managed_account_id",
      },
    },
  ],
}

const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsToMany: [
    {
      target: "SalesPerson",
      options: {
        as: "participants",
        through: "AccountSalesPerson",
        foreignKey: "managed_account_id",
        otherKey: "participant_id",
      },
    },
  ],
}
```

1. Creates a table `sales_person` with the columns `id`, `first_name` and a table `account` with the columns `id` and `name` and a junction table with the columns `participant_id` and `managed_account_id`.
1. Creates relationships as `accounts` and `participants`.
1. Returns `JSONAPI` from `GET /account/1?include=participants` like:

```json
{
  "jsonapi": {
    "version": "1.0"
  },
  "data": {
    "type": "Account",
    "id": "12-22",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "participants": [
        {
          "data": {
            "type": "SalesPerson",
            "id": "332-222"
          }
        }
      ]
    },
    "included": [
      {
        "type": "SalesPerson",
        "id": "332-222",
        "attributes": {
          "firstName": "John"
        }
      }
    ]
  }
}
```
