# Schema Naming: Database, Service API, and UI

This document describes the relationship between names in the schema and the resulting names used in the database, service APIs, and UI. We will first go over the general guidelines and then how specific parts in the schema relate to names in the database, service API, and UI.

- [General Guidelines](#general-guidelines)
  - [Casing](#casing)
  - [Singular vs Plural](#singular-vs-plural)
- [Schema](#schema)
  - [name](#name)
  - [pluralName](#pluralname)
  - [tableName](#tablename)
  - [namespace](#namespace-postgres-only)
  - [id](#id)
  - [displayAttribute](#displayattribute)
  - [attributes](#attributes)
    - [displayName](#displayname)
  - [relationships](#relationships)
    - [belongsTo](#belongsto)
    - [hasMany](#hasmany)
    - [hasMany.through](#hasmanythrough)
    - [hasOne](#hasone)

## General Guidelines

Hatchify attempts to adhere to the most common naming pattern conventions. The following are the casing and pluralization guidelines that Hatchify uses.

### Casing

By default, Hatchify uses PascalCase (Ex: `SalesPerson`) for type names and uses camelCase names for member names (Ex: `firstName`). The following are the exceptions:

- Tables and table column names use snake_case (Ex: `sales_person` table and `first_name` field).
- Service URL path names are kebab-case. (Ex: `/sales-people`) _Note: Query parameters are camelCase._

### Singular vs Plural

Hatchify simply adds an "s" to make values names plural. We will show how to customize this below.

The following are **singular**:

- Schema model names (Ex: `SalesPerson`)
- Table names (Ex: `sales_person`)
- `belongsTo` relationship names (Ex: `manager: belongsTo("SalesPerson")`)

The following are **plural**:

- Service URL path names (Ex: `/sales-persons`)
- `hasMany` relationship names (Ex: `managers: hasMany("SalesPerson")`)

## Schema

This section shows how each part of the schema relates to the database, service API, or UI.

### name

The schema `name` should be singular PascalCase as follows:

```ts
const SalesPerson = {
  name: "SalesPerson", // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

#### Database Implications

Creates a `sales_person` table.

#### API Implications

##### Querying Data

Creates a `/sales-persons` API.
`SalesPerson` will be used in the `fields` query parameter:

```js
GET /api/sales-persons?fields[SalesPerson]=name
```

##### Data Response

`SalesPerson` will be used as the response `type`:

```js
{
  data: {
    type: "SalesPerson" // 👀
    ...
  }
}
```

### pluralName

Optionally set the `pluralName` to configure plural naming for a schema.

```ts
const SalesPerson = {
  name: "SalesPerson",
  pluralName: "SalesPeople", // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

#### API Implications

##### Querying Data

Creates a `/sales-people` API.
`name` will still be used in the `fields` query parameter:

```js
GET /api/sales-persons?fields[SalesPerson]=name
```

##### Data Response

`name` will still be used as the response `type`:

```js
{
  data: {
    type: "SalesPerson"
    ...
  }
}
```

### tableName

Optionally set `tableName` to control the name of the database table for the schema.

```ts
const SalesPerson = {
  name: "SalesPerson",
  tableName: "acme_sales_people", // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

**Database Implications:**

- Creates a table `acme_sales_people`.

### namespace (Postgres only)

Optionally set `namespace` when using Postgres to use [Postgres Schemas](https://www.postgresql.org/docs/current/ddl-schemas.html) which are like namespaces for tables. The `namespace` must be written as singular PascalCase as follows:

```ts
const AcmeCorp_SalesPerson = {
  name: "SalesPerson",
  namespace: "AcmeCorp", // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

#### Database Implications

Creates a table `sales_person` in the Postgres schema `acme_corp`.

#### API Implications

##### Querying Data

Creates an `acme-corp/sales-persons` API.
`namespace_name`, will be used in the `fields` query parameter:

```js
GET /api/acme-corp/sales-persons?fields[AcmeCorp_SalesPerson]=name
```

##### Data Response

`namespace_name` will be used as the response `type`:

```js
{
  data: {
    type: "AcmeCorp_SalesPerson", //👀
    id: "f06f81f2-4bea-4a60-99ad-8da8ecf79473",
    ...
  }
}
```

##### Returned Models Implications

`hatchifyKoa({AcmeCorp_SalesPerson})` returns `models.AcmeCorp_SalesPerson`
`hatchifyReact({AcmeCorp_SalesPerson})` returns `[components|model|state].AcmeCorp_SalesPerson`

### id

JSON:API requires that the `id` attribute be named `id`, therefore this attribute cannot be renamed.

For more information on customizing the `id` attribute: [id](../schema/schema.md). 🛑

### displayAttribute

Optionally set the `displayAttribute` to configure which attribute is used to display a relationship in the UI. If the `displayAttribute` is not set, then the first attribute will be used.

```ts
const SalesPerson = {
  name: "SalesPerson",
  displayAttribute: "email", // 👀
  attributes: {
    name: string(),
    email: string(),
  },
  relationships: {
    accounts: hasMany("Account"),
  },
} satisfies PartialSchema

const Account = {
  name: "Account",
  attributes: {
    name: string(),
  },
  relationships: {
    salesPerson: belongsTo("SalesPerson"),
  },
} satisfies PartialSchema
```

#### UI Implications

When displaying an `Account` table in the UI, the `email` attribute will be used in the "Sales Person" column. If `displayAttribute` was not set, then the `name` attribute would have been used.

### attributes

An attribute name should be singular camelCase.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Creates a column `first_name` in the `sales_person` table.

#### API Implications

##### Querying Data

Creates a `/sales-persons` API.
`firstName` will be used in the query parameters:

```js
GET /api/sales-persons?fields[SalesPerson]=firstName
```

##### Data Response

`firstName` will be used in the mutation and response payloads:

```js
{
  data: {
    type: "SalesPerson",
    id: "c98b2123-78e7-45e4-b57f-f9c1189bfd19",
    attributes: { firstName: "Mary" } //👀
  }
}
```

#### displayName

The `displayName` is an optional parameter that can be used to customize the display name of an individual attribute in the UI. If `displayName` is not set, then the attribute key will be transformed to Title Case.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
    lastName: string({ displayName: "Surname" }), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

This has no effect on the database.

#### API Implications

This has no effect on the API.

#### UI Implications

The `lastName` attribute will be displayed as "Surname" in the table header and filter dropdowns.

For more information on attributes: [attributes](../schema/attribute-types/README.md).

### relationships

#### belongsTo

`belongsTo` relationship fields should be singular camelCase.

```ts
const Account = {
  name: "Account",
  attributes: {
    name: string(),
  },
  relationships: {
    salesPerson: belongsTo("SalesPerson"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Creates a column `sales_person_id` column in the `account` table.

#### API Implications

##### Querying Data

`salesPerson` will be used in the `include` query parameter:

```js
GET /api/accounts?include=salesPerson
```

##### Data Response

`salesPerson` will be used in the mutation and response payloads:

```js
{
  data: {
    type: "Account",
    id: "2dba27ba-deaa-4656-a256-fb712f286c08",
    attributes: { firstName: "Acme" },
    relationships: {
      salesPerson: { //👀
        data: [
          {
            type: "SalesPerson",
            id: "619d107b-0655-4a31-a704-13eb47d3f9c1"
          }
        ]
      }
    }
  }
}
```

For more information on this relationship type: [belongsTo](../schema/relationship-types/belongs-to.md).

#### hasMany

`hasMany` relationship fields should be plural camelCase.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    accounts: hasMany("Account"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a column `sales_person_id` in the `account` table.

#### API Implications

##### Querying Data

`accounts` will be used in the `include` query parameter:

```js
GET /api/sales-persons?include=accounts
```

##### Data Response

`accounts` will be used in the mutation and response payloads:

```js
{
  data: {
    type: "SalesPerson",
    id: "172a139c-1b91-4c93-9a0a-27e963e3337f",
    attributes: { firstName: "Mary" },
    relationships: {
      accounts: { //👀
        data: [
          {
            type: "Account",
            id: "dc4985ed-1078-4a34-add8-06c92b5ac82b"
          }
        ]
      }
    }
  }
}
```

For more information on this relationship type: [hasMany](../schema/relationship-types/has-many.md).

#### hasMany.through

There is no strict naming convention for `hasMany.through` relationships. If you would like to customize the name of the join table or the join table columns, then you can use the `through` method as follows:

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany("Account").through("Assignments", { targetKey: "accountId", sourceKey: "salesPersonId" }), // 👀
  },
} satisfies PartialSchema
```

For more information on this relationship type: [hasMany.through](../schema/relationship-types/has-many-through.md).

#### hasOne

`hasOne` relationship fields should be singular camelCase.

```ts
const Account = {
  name: "Account",
  attributes: {
    name: string(),
  },
  relationships: {
    manager: hasOne("Manager"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Creates a column `manager_id` column in the `account` table.

#### API Implications

##### Querying Data

`manager` will be used in the `include` query parameter:

```js
GET /api/accounts?include=manager
```

##### Data Response

`manager` will be used in the mutation and response payloads:

```js
{
  data: {
    type: "Account",
    id: "a8f3956a-bea8-4dbc-89c2-8b33c8dfc906",
    attributes: { firstName: "Acme" },
    relationships: {
      manager: { //👀
        data: [
          {
            type: "Manager",
            id: "79d44865-0f9f-484a-8788-f8a27b8354b5"
          }
        ]
      }
    }
  }
}
```

For more information on this relationship type: [hasOne](../schema/relationship-types/has-one.md).
