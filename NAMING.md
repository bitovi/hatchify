# Customizing schema, table, relationship, and service API naming

## Guidelines

- Model names should be singular and use `PascalCase`
  - `as` should be used for all relationships with a `camelCase` names to be implicit and to override `Sequelize`'s default. This value is used for customizing the relationship name and will help determining the column name in the database.
  - `foreignKey` can be used
- Table names should be singular and use `snake_case`. Databases like Postgres requires wrapping all non-lower case table and field names with double quotes.
- URLs should be singular or plural depends on relationships and use `kebab-case` for model names and includes
- Request payloads and response bodies should be singular or plural depends on relationships and use:
  - `PascalCase` for model names
  - `camelCase` for relationships
- Hatchify backend as well as [Sequelize](https://www.npmjs.com/package/sequelize) are using [Inflection](https://www.npmjs.com/package/inflection) for pluralization of names. It takes care of irregular nouns for us.

## Examples

Given the following schemas:

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [
    {
      target: "SalesPerson",
      options: {
        as: "salesPerson",
      },
    },
  ],
}

const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    name: "STRING",
  },
  hasMany: [
    {
      target: "Account",
      options: {
        as: "accounts",
      },
    },
  ],
}
```

The function `hatchify.createDatabase()` will create the following:

1. A table named `account` with the columns `id` and `name` and `sales_person_id` with a foreign key to `sales_person.id`.
1. A table named `sales_person` with the columns `id`, `name`.

The server will already have the following endpoints for accounts:

1. `GET /api/accounts`
1. `GET /api/accounts/:id`
1. `PATCH /api/accounts/:id`
1. `DELETE /api/accounts/:id`

And the following endpoints for sales persons:

1. `GET /api/sales-persons`
1. `GET /api/sales-persons/:id`
1. `PATCH /api/sales-persons/:id`
1. `DELETE /api/sales-persons/:id`

A payload to `POST /api/accounts` will look like:

```json
{
  "data": {
    "type": "Account",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "salesPerson": {
        "data": {
          "type": "SalesPerson",
          "id": "1"
        }
      }
    }
  }
}
```

A response from `GET /api/accounts/1?include=sales-person` will look like:

```json
{
  "jsonapi": { "version": "1.0" },
  "data": {
    "type": "Account",
    "id": "1",
    "attributes": {
      "name": "Bitovi"
    },
    "relationships": {
      "salesPerson": {
        "data": {
          "type": "SalesPerson",
          "id": "1"
        }
      }
    }
  },
  "included": [
    {
      "type": "SalesPerson",
      "id": "1",
      "attributes": {
        "name": "John Doe"
      }
    }
  ]
}
```

A response from `GET /api/sales-persons/1?include=accounts` will look like:

```json
{
  "jsonapi": { "version": "1.0" },
  "data": {
    "type": "SalesPerson",
    "id": "1",
    "attributes": {
      "name": "John Doe"
    },
    "relationships": {
      "accounts": {
        "data": [
          {
            "type": "Account",
            "id": "1"
          }
        ]
      }
    }
  },
  "included": [
    {
      "type": "Account",
      "id": "1",
      "attributes": {
        "name": "Bitovi"
      }
    }
  ]
}
```

## Customizations

### Relationships

Other than the required `target` field, you can leverage other options to control the naming:

- `as` to set the relationship name
- `foreignKey` to set the name of the foreign key. By default it is `${model}Id`
- `sourceKey` to set the foreign key column name for `hasOne` and `hasMany`
- `targetKey` to set the foreign key column name for `belongsTo` and `belongsToMany`
- `through` is used for `belongsToMany` to control the name of the junction table

For more information, refer to the [Sequelize Docs](https://sequelize.org/docs/v6/core-concepts/assocs/)
