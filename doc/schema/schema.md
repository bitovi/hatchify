# Schema

This guide explains the relationship between names in the schema and the resulting names used in the database and service APIs. We will first go over the general guidelines and then how specific parts in the schema relate to names in the database and service API.

<pre>
import { PartialSchema, belongsTo, boolean, datetime, integer, hasMany, string } from "@hatchifyjs/core"
  
export const SalesPerson = {
  <a href="./naming.md#schemaname">name</a>: "SalesPerson",
  <a href="./naming.md#schemapluralname">pluralName</a>: "SalesPeople",
  <a href="./naming.md#schemadisplayattribute">displayAttribute</a>: "description",
  id: <a href="./attribute-types/uuid.md">uuid</a>({ required: true }),
  attributes: {
    <a href="./schema.md#schemaattributesattribute_name">[AttributeName]</a>: AttributeType,
    description: <a href="./attribute-types/text">text</a>(),
    dueDate:     <a href="./attribute-types/datetime">datetime</a>({ displayName: "Due Date" }),
    importance:  <a href="./attribute-types/integer.md">integer</a>({ min: 0, max: 100, step: 10 }),
    complete:    <a href="./attribute-types/boolean.md">boolean</a>({ default: false }),
  },
  relationships: {
    salesGroup: <a href="./relationship-types/belongs-to.md">belongsTo</a>(),
    accounts:   <a href="./relationship-types/has-many.md">hasMany</a>(),
    todos:      hasMany().<a href="./relationship-types/has-many-through.md">through</a>()
  } satisfies <a href="./naming.md">PartialSchema</a>,
}
</pre>

## General Guidelines

Hatchify attempts to adhere to the most common naming pattern conventions. The following are the casing and pluralization guidelines that Hatchify uses.

### Casing

By default, Hatchify uses `PascalCase` (Ex: `SalesPerson`) for type names and use `camelCase` names for member names (Ex: `firstName`). The following are the exceptions:

- Tables and table column names use `snake_case` (Ex: `sales_person` table, and `first_name` field).
- Service URL path names are `kebab-case`. (Ex: `/sales-people`) _Note: Query parameters are `camelCase`._

### Singular vs Plural

Hatchify simply adds an "s" to make values names plural. We will show how to customize this below.

The following are **singular**:

- Schema model names (Ex: `SalesPerson`)
- Table names (Ex: `sales_person`)
- BelongsTo relationship names (Ex: `{ as: "manager" }`)

The following are **plural**:

- Service URL path names (Ex: `/sales-persons`)
- HasMany relationship names (Ex: `{ as: "managers" }`)

## Schema Naming

This section shows how each part of the schema relates to the Database or service API design.

### Terms

Source schema - The schema the definition is written in.
Target schema - The schema the Source schema is establishing a relationship with.

### Schema.name

The schema name should be `Singular PascalCase` as follows:

```ts
const SalesPerson = {
  name: "SalesPerson", // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

#### Database Implications

Creates a table `sales_person`.

#### API Implications

##### Querying Data

This will create a `/sales-persons` API.
When referencing this type in the `fields`, `SalesPerson` will be used:

```
GET /api/sales-persons?fields[SalesPerson]=name
```

##### Data Response

`SalesPerson` will be used as the response `type`: `{data: {type: "SalesPerson"}}`

### Schema.pluralName

Set `pluralName` to configure plural naming for that type.

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

Create a `/sales-people` API.

### Schema.displayAttribute

`displayAttribute` must be _singular camelCase_. It defines which attribute will be used for the schema if presented as a single column. Defaults to the first attribute.

```ts
const SalesPerson = {
  name: "SalesPerson",
  displayAttribute: "lastName",
  attributes: {
    firstName: string(),
    lastName: string(),
  },
} satisfies PartialSchema
```

#### Database Implications

This does not have database implications.

#### API Implications

This does not change the API behavior.

### Schema.namespace `postgres-only`

Set namespace when using Postgres to set use [Postgres Schema](https://www.postgresql.org/docs/current/ddl-schemas.html) which are like a namespace for tables. The namespace must be written as Singular PascalCase as follows:

```
const AcmeCorp_SalesPerson = {
  name: "SalesPerson",
  namespace: "AcmeCorp", // 👀
  attributes: { ... }
}
```

#### Database Implications

Creates a table sales_person in the Postgres schema acme_corp

#### API Implications

##### Querying Data

This will create an `acme-corp/sales-persons` API
When referencing this in the type fields, AcmeCorp_SalesPerson will be used:

```
GET /api/acme-corp/sales-persons?fields[AcmeCorp_SalesPerson]=name
```

##### Data Response

Data will be returned like:

```json
{
  "data": {
    "type": "AcmeCorp_SalesPerson",  // same as in "included"
    "id": "....",
    "attributes": { .... }
  }
}
```

#### Returned Models Implications

`hatchifyKoa({AcmeCorp_SalesPerson})` returns `models.AcmeCorp_SalesPerson`

### Schema.attributes.ATTRIBUTE_NAME

An attribute name should be `Singular camelCase`.

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

`firstName` will be used in query parameters like:

```
GET /api/sales-persons?filter[firstName]=Mary&fields[SalesPerson]=firstName
```

##### Data Response

`firstName` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" } // 👀
  }
}
```

### relationships.belongsTo

A schema name is required. It must match a `Schema.name` and be _Singular PascalCase_.

```ts
const Account = {
  name: "Account",
  attributes: {
    name: string(),
  },
  relationships: {
    salesPerson: belongsTo("SalesPerson"), // 👀
  },
}
```

#### Database Implications

Creates a column `sales_person_id` column in the `account` table.

#### API Implications

##### Querying Data

`salesPerson` will be used in the include query parameter like:

```
GET /api/accounts?include=salesPerson
```

##### Data Response

`salesPerson` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "Account",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Acme" },
    "relationships": {
      "salesPerson": {
        "data": [
          { "type": "SalesPerson", "id": "abcdefgh-ijkl-mnop-qrst-000000000322" } // 👀
        ]
      }
    }
  }
}
```

### Property name of relationships.belongsTo

The property name should be _Singular camelCase_.

```ts
const Account = {
  name: "Account",
  attributes: {
    name: string(),
  },
  relationships: {
    closerPerson: belongsTo("SalesPerson"), // 👀
  },
}
```

#### Database Implications

Creates a column `closer_person_id` in the `account` table.

#### API Implications

##### Querying Data

`closerPerson` will be used in the include query parameter like:

```
GET /api/accounts?include=closerPerson
```

##### Data Response

`closerPerson` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "Account",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Acme" },
    "relationships": {
      "closerPerson": {
        "data": [
          { "type": "SalesPerson", "id": "abcdefgh-ijkl-mnop-qrst-000000000322" } // 👀
        ]
      }
    }
  }
}
```

### relationships.belongsTo.sourceAttribute

`sourceAttribute` sets the name of the relationship column. `sourceAttribute` should be _camelCase_.

> NOTE: `sourceAttribute` could reference a _camelCase_ attribute in the source schema.

```ts
const Account = {
  name: "Account",
  attributes: {
    name: string(),
  },
  relationships: {
    closerPerson: belongsTo("SalesPerson", { sourceAttribute: "finisherId" }), // 👀
  },
}
```

#### Database Implications

Creates a column `finisher_id` in the `account` table.

#### API Implications

There are no changes to the API.

### relationships.hasMany

A schema name is required. it must match a `Schema.name` and be _Singular PascalCase_.

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

`accounts` will be used in the include query parameter like:

```
GET /api/sales-persons?include=accounts
```

##### Data Response

`accounts` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" },
    "relationships": {
      "accounts": {
        "data": [{ "type": "Account", "id": "abcdefgh-ijkl-mnop-qrst-000000000456" }] // 👀
      }
    }
  }
}
```

### Property name of relationships.hasMany

The property name should be _Plural camelCase_.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    managingAccounts: hasMany("Account"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a column `sales_person_id` in the `account` table.

#### API Implications

##### Querying Data

`managingAccounts` will be used in the include query parameter like:

```
GET /api/sales-persons?include=managingAccounts
```

##### Data Response

`managingAccounts` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" },
    "relationships": {
      "managingAccounts": {
        "data": [{ "type": "Account", "id": "abcdefgh-ijkl-mnop-qrst-000000000456" }] // 👀
      }
    }
  }
}
```

### relationships.hasMany.targetAttribute

`targetAttribute` specifies the column used in the target schema that references a _camelCase_ attribute name in the target schema.

The following shows specifying a column name.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    openedAccounts: hasMany("Account", { targetAttribute: "openingSalesPersonId" }), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a column `opening_sales_person_id` in the `account` table.

#### API Implications

This has no effect on the API.

### relationships.hasOne

A schema name is required. it must match a `Schema.name` and be _Singular PascalCase_.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    accounts: hasOne("Account"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a column `sales_person_id` in the `account` table.

#### API Implications

##### Querying Data

`account` will be used in the include query parameter like:

```
GET /api/sales-persons?include=account
```

##### Data Response

`account` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" },
    "relationships": {
      "account": {
        "data": { "type": "Account", "id": "abcdefgh-ijkl-mnop-qrst-000000000456" } // 👀
      }
    }
  }
}
```

### Property name of relationships.hasOne

The property name should be _singular camelCase_.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    managingAccount: hasOne("Account"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a column `sales_person_id` in the `account` table.

#### API Implications

##### Querying Data

`managingAccount` will be used in the include query parameter like:

```
GET /api/sales-persons?include=managingAccount
```

##### Data Response

`managingAccount` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" },
    "relationships": {
      "managingAccount": {
        "data": { "type": "Account", "id": "abcdefgh-ijkl-mnop-qrst-000000000456" } // 👀
      }
    }
  }
}
```

### relationships.hasOne.targetAttribute

`targetAttribute` specifies the column used in the target schema that references a _camelCase_ attribute name in the target schema.

The following shows specifying a column name.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    openedAccount: hasOne("Account", { targetAttribute: "openingSalesPersonId" }), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a column `opening_sales_person_id` in the `account` table.

#### API Implications

This has no effect on the API.

### relationships.belongsTo.through

A schema name is required. it must match a `Schema.name` and be _Singular PascalCase_.

The following creates a belongsToMany relationship
that acts similar to `hasMany`.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    accounts: belongsTo("Account").through(), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a table `account_sales_person` exists with `sales_person_id` and `account_id` columns. The table is `account_sales_person` because account is first alphabetically.

#### API Implications

##### Querying Data

`accounts` will be available in the include query parameter like:

```
GET /api/sales-persons?include=accounts
```

##### Data Response

`accounts` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" },
    "relationships": {
      "accounts": {
        "data": [{ "type": "Account", "id": "abcdefgh-ijkl-mnop-qrst-000000000456" }] // 👀
      }
    }
  }
}
```

### Schema name for relationships.belongsTo.through

Schema name must be _singular PascalCase_.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    accounts: belongsTo("Account").through("SalesAccount"), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a `sales_account` table exists with `sales_person_id` and `account_id` columns.

#### API Implications

This does not change the API behavior.

### Property name of relationships.belongsToMany.options

The property name must be _plural camelCase_.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    salesAccounts: belongsTo("Account").through(), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

This does not change the Database behavior.

#### API Implications

##### Querying Data

`salesAccounts` will be available in the include query parameter like:

```
GET /api/sales-persons?include=salesAccounts
```

##### Data Response

`salesAccounts` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "abcdefgh-ijkl-mnop-qrst-000000000001",
    "attributes": { "firstName": "Mary" },
    "relationships": {
      "salesAccounts": {
        "data": [{ "type": "Account", "id": "abcdefgh-ijkl-mnop-qrst-000000000456" }] // 👀
      }
    }
  }
}
```

### relationships.belongsTo.through.throughSourceAttribute

`throughSourceAttribute` must be _singular camelCase_.

> `throughSourceAttribute` can also reference an attribute in the "Join" schema.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    accounts: belongsTo("Account").through("SalesAccount", { throughSourceAttribute: "sellerId" }), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a table `account_sales_person` exists with `seller_id` and `account_id` columns.

#### API Implications

This does not change the API behavior.

### relationships.belongsTo.through.throughTargetAttribute

`throughTargetAttribute` must be _singular camelCase_.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
  },
  relationships: {
    accounts: belongsTo("Account").through("SalesAccount", { throughTargetAttribute: "soldAccountId" }), // 👀
  },
} satisfies PartialSchema
```

#### Database Implications

Assumes a table `account_sales_person` exists with `sales_person_id` and `sold_account_id` columns.

#### API Implications

This does not change the API behavior.

## To Be Defined

How to load through tables
