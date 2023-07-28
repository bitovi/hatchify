# Schema, database, and service API naming

This guide explains the relationship between names in the schema and the resulting names used in the database and service APIs. We will first go over the general guidelines and then how specific parts in the schema relate to names in the database and service API.

- [General Guidelines](#general-guidelines)
  * [Casing](#casing)
  * [Singular vs Plural](#singular-vs-plural)
- [Schema Naming](#schema-naming)
  * [Schema.name](#schemaname)
  * [Schema.pluralName](#schemapluralname)
  * [Schema.attributes.ATTRIBUTE_NAME](#schemaattributesattribute_name)
  * [relationships.belongsTo](#relationshipsbelongsto)
  * [relationships.belongsTo.foreignKey](#relationshipsbelongstoforeignkey)
  * [relationships.hasMany](#relationshipshasmany)
  * [relationships.hasMany.foreignKey](#relationshipshasmanyforeignkey)
  * [relationships.belongsToMany](#relationshipsbelongstomany)
  * [relationships.belongsToMany.options.through](#relationshipsbelongstomanyoptionsthrough)
  * [relationships.belongsToMany.options.as](#relationshipsbelongstomanyoptionsas)
  * [relationships.belongsToMany.options.foreignKey](#relationshipsbelongstomanyoptionsforeignkey)
  * [relationships.belongsToMany.options.otherKey](#relationshipsbelongstomanyoptionsotherkey)
- [To Be Defined](#to-be-defined)


## General Guidelines

Hatchify attempts to adhere to the most common naming pattern conventions. The following are the casing and pluralization guidelines that Hatchify uses.  

### Casing

By default, Hatchify uses `PascalCase` (Ex: `SalesPerson`) for type names and use `camelCase` names for member names (Ex: `firstName`). The following are the exceptions:

- Tables and table column names use `snake_case` (Ex: `sales_person` table, and `first_name` field).
- Service URL path names are `kebab-case`.  (Ex: `/sales-people`) _Note: Query parameters are `camelCase`._

### Singular vs Plural

Hatchify simply adds an "s" to make values names plural. We will show how to customize this below.

The following are __singular__:

- Schema model names (Ex: `SalesPerson`)
- Table names (Ex: `sales_person`)
- BelongsTo relationship names (Ex: `{ as: "manager" }`)

The following are __plural__:

- Service URL path names (Ex: `/sales-persons`)
- HasMany relationship names (Ex: `{ as: "managers" }`)

## Schema Naming

This section shows how each part of the schema relates to the Database or service API design.  


### Schema.name

The schema name should be `Singular PascalCase` as follows:

```js
const Account = {
  name: "SalesPerson", //👀
}
```

**Database Implications:**

- Creates a table `sales_persons`.

**API Implications:**

- This will create a `/sales-persons` API.
- When referencing this type in the `fields`, `SalesPerson` will be used: `GET /sales-people?fields[SalesPerson]=name`
- `SalesPerson` will be used as the response `type`: `{data: {type: "SalesPerson"}}`

### Schema.pluralName

Set `pluralName` to configure plural naming for that type.  

```js
const Account = {
  name: "SalesPerson",
  pluralName: "SalesPeople" //👀
}
```

**API Implications**

- Create a `/sales-people` API.

### Schema.attributes.ATTRIBUTE_NAME

An attribute name should be `Singular camelCase`.

```js
const Account = {
  name: "SalesPerson",
  pluralName: "SalesPeople",
  attributes: {
    firstName: "STRING" //👀
  }
}
```

**Database Implications**

- Creates a column `first_name` in the `sales_person` table.

**API Implications**

- `firstName` will be used in query parameters like
  `GET /sales-persons?filter[firstName]=Roye`
- `firstName` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Roye" } //👀
    }
  }
  ```

### relationships.belongsTo

A `target` and `as` option are required.

- `target` should match a `Schema.name` and be _Singular PascalCase_.
- `as` should be _Singular camelCase_.

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{ target: "SalesPerson", options: { as: "closerPerson" } }], //👀
}
```

**Database Implications**

- Creates a column `closer_person_id` in the `account` table.

**API Implications**

- `closerPerson` will be used in the include query parameter like
  `GET /accounts?include=closerPerson`
- `closerPerson` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "Account",
      id: "1",
      attributes: { firstName: "Acme" },
      relationships: {
        closerPerson: {type: "SalesPerson", id: "322"} //👀
      }
    }
  }
  ```





### relationships.belongsTo.foreignKey

`foreignKey` sets the name of the relationship column. `foreignKey` should be _snake_case_.

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{
    target: "SalesPerson",
    options: { as: "closer", foreignKey: "finisher_id" } //👀
  }],
}
```

**Database Implications**

- Creates a column `finisher_id` in the `account` table.

### relationships.hasMany

A `target` and `as` option are required.

- `target` must match a `Schema.name` and be _Singular PascalCase_.
- `as` should be _Singular camelCase_.



```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  hasMany: [
    { target: "Account", options: { as: "accounts" } } //👀
  ],
}
```

**Database Implications**

- Assumes a column `sales_person_id` in the `Account` table.

**API Implications**

- `accounts` will be used in the include query parameter like
  `GET /sales-persons?include=accounts`
- `accounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Roye" },
      relationships: {
        accounts: [{type: "Account", id: "456"}] //👀
      }
    }
  }
  ```

### relationships.hasMany.foreignKey

`foreignKey` specifies the column in used in the target table that references either:
- a _snake_case_ column name in the target table
- a _camelCase_ attribute name in the target schema

The following shows specifying a column name.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  hasMany: [
    { target: "Account",
      options: {
        as: "openedAccounts", foreignKey: "opening_sales_person_id" } } //👀
  ],
}
```

**Database Implications**

- Assumes a column `opening_sales_person_id` in the `account` table❗

**API Implications**

- `openedAccounts` will be used in the include query parameter like
  `GET /sales-persons?include=openedAccounts`
- `openedAccounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Roye" },
      relationships: {
        openedAccounts: [{type: "Account", id: "456"}] //👀
      }
    }
  }
  ```


### relationships.belongsToMany

`target` must match a `Schema.name` and be _singular PascalCase_.

The following creates a belongsToMany relationship
that acts similar to `hasMany`.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account" //👀
    }
  ],
}
```

**Database Implications**

- Assumes a table `account_sales_person` exists with `sales_person_id` and `account_id` columns.  The table is `account_sales_person` because account is first alphabetically.

**API Implications**

- `accounts` will be available in the include query parameter like
  `GET /sales-persons?include=accounts`
- `accounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Roye" },
      relationships: {
        accounts: [{type: "Account", id: "456"}] //👀
      }
    }
  }
  ```

The implied through table will also be available.

- `accounts` will be available in the include query parameter like
  `GET /sales-persons?include=accounts`
- `accounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Roye" },
      relationships: {
        accounts: [{type: "Account", id: "456"}] //👀
      }
    }
  }
  ```


### relationships.belongsToMany.options.through

`through` must be _singular PascalCase_.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account",
      options: {through: "SalesAccounts"}
    }
  ],
}
```

**Database Implications**

- Assumes a `sales_accounts` table exists with `sales_person_id` and `account_id` columns.  

**API Implications**

This does not change the API behavior.

### relationships.belongsToMany.options.as

`as` must be _plural camelCase_.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account",
      options: {as: "salesAccounts"}
    }
  ],
}
```

**Database Implications**

This does not change the Database behavior.

**API Implications**

- `salesAccounts` will be available in the include query parameter like
  `GET /sales-persons?include=salesAccounts`
- `salesAccounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Roye" },
      relationships: {
        salesAccounts: [{type: "Account", id: "456"}] //👀
      }
    }
  }
  ```

### relationships.belongsToMany.options.foreignKey

`foreignKey` must be _singular snake_case_.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account",
      options: {foreignKey: "seller_id"}
    }
  ],
}
```

**Database Implications**

- Assumes a table `account_sales_person` exists with `seller_id` and `account_id` columns.  

**API Implications**

This does not change the API behavior.

### relationships.belongsToMany.options.otherKey

`otherKey` must be _singular snake_case_.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  belongsToMany: [
    {
      target: "Account",
      options: {otherKey: "sold_account_id"}
    }
  ],
}
```

**Database Implications**

- Assumes a table `account_sales_person` exists with `sales_person_id` and `sold_account_id` columns.  

**API Implications**

This does not change the API behavior.

## To Be Defined 

- How to load through tables
