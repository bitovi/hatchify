# PartialSchema

`PartialSchema` is a type that represents a Hatchify schema. This document describes the relationship between names in the schema and the resulting names used in the database, service APIs, and UI. We will first review the general guidelines and then how specific parts in the schema relate to names in the database, service API, and UI.

- [General Guidelines](#general-guidelines)
  - [Casing](#casing)
  - [Singular vs Plural](#singular-vs-plural)
- Schema
  - [name](#name)
  - [pluralName](#pluralname)
  - [tableName](#tablename)
  - [namespace](#namespace-postgres-only)
  - [id](#id)
  - [displayAttribute](#displayattribute)
  - [attributes](#attributes)
  - [relationships](#relationships)

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

## name

The schema `name` should be singular PascalCase as follows:

```ts
const SalesPerson = {
  name: "SalesPerson", // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

### 💾 Database Implications

Creates a `sales_person` table.

### ↔️ API Implications

**_Querying Data_**

Creates a `/sales-persons` API.
`SalesPerson` will be used in the `fields` query parameter:

```js
GET /api/sales-persons?fields[SalesPerson]=name
```

**_Data Response_**

`SalesPerson` will be used as the response `type`:

```json
{
  "data": {
    "type": "SalesPerson" // 👀
    ...
  }
}
```

### 🖼️ UI Implications

Unless `displayName` is specified, the name value is used for:

- column headers
- form labels

## pluralName

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

### ↔️ API Implications

**_Querying Data_**

Creates a `/sales-people` API.
`name` will still be used in the `fields` query parameter:

```js
GET /api/sales-persons?fields[SalesPerson]=name
```

**_Data Response_**

`name` will still be used as the response `type`:

```json
{
  "data": {
    "type": "SalesPerson"
    ...
  }
}
```

## tableName

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

### 💾 Database Implications

- Creates a table `acme_sales_people`.

### readOnly

Optionally set `readOnly` to create only GET middleware for this schema. This is useful when data is populated from somewhere else or when pointing the schema to a SQL view.

```ts
const SalesPerson = {
  name: "SalesPerson",
  readOnly: true, // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

### ↔️ API Implications

- Prevent creation of the create/update/delete middleware.

## namespace (Postgres only)

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

### 💾 Database Implications

Creates a table `sales_person` in the Postgres schema `acme_corp`.

### ↔️ API Implications

**_Querying Data_**

Creates an `acme-corp/sales-persons` API.
`namespace_name`, will be used in the `fields` query parameter:

```js
GET /api/acme-corp/sales-persons?fields[AcmeCorp_SalesPerson]=name
```

**_Data Response_**

`namespace_name` will be used as the response `type`:

```json
{
  "data": {
    "type": "AcmeCorp_SalesPerson", // 👀
    "id": "f06f81f2-4bea-4a60-99ad-8da8ecf79473",
    ...
  }
}
```

### ↺ Returned Models Implications

`hatchifyKoa({AcmeCorp_SalesPerson})` returns `models.AcmeCorp_SalesPerson`
`hatchifyReact({AcmeCorp_SalesPerson})` returns `[components|model|state].AcmeCorp_SalesPerson`

## id

JSON:API requires that the `id` attribute be named `id`, therefore this attribute cannot be renamed.

Customizing the `id` attribute is as simple as adding an attribute:

```ts
const SalesPerson = {
  name: "SalesPerson",
  id: integer({ autoIncrement: true }), // 👀
  attributes: {
    firstName: string(),
  },
} satisfies PartialSchema
```

## displayAttribute

Optionally set the `displayAttribute` to configure which attribute is used to display a relationship in the UI. If the `displayAttribute` is not set, then the first attribute will be used.

```ts
const SalesPerson = {
  name: "SalesPerson",
  ui: { displayAttribute: "email" }, // 👀
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

### 🖼️ UI Implications

When displaying an `Account` table in the UI, the `email` attribute will be used in the "Sales Person" column. If `displayAttribute` was not set, then the `name` attribute would have been used.

## attributes

Naming for [attributes](./attribute-types/README.md)

## relationships

Naming for [relationships](./relationship-types/README.md):

- [belongsTo](./relationship-types/belongs-to.md)
- [hasMany](./relationship-types/has-many.md)
- [hasMany.through](./relationship-types/has-many-through.md)
- [hasOne](./relationship-types/has-one.md)
