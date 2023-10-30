# Schema

This guide explains the relationship between names in the schema and the resulting names used in the database and service APIs. We will first go over the general guidelines and then how specific parts in the schema relate to names in the database and service API.

<pre>
import { PartialSchema, belongsTo, boolean, datetime, integer, hasMany, string } from "@hatchifyjs/core"
  
export const SalesPerson: <a href="./naming.md">PartialSchema</a> = {
  <a href="./naming.md#schemaname">name</a>: "SalesPerson",
  <a href="./naming.md#schemapluralname">pluralName</a>: "SalesPeople",
  id: <a href="./attribute-types/uuid.md">uuid</a>({required: true, autoIncrement: true}),
  attributes: {
    <a href="./schema.md#schemaattributesattribute_name">[AttributeName]</a>: AttributeType,
    description: <a href="./attribute-types/text">text</a>(),
    dueDate:     <a href="./attribute-types/datetime">datetime</a>(),
    importance:  <a href="./attribute-types/integer.md">integer</a>({min: 0, max: 100, step: 10}),
    complete:    <a href="./attribute-types/boolean.md">boolean</a>({ default: false }),
  },
  relationships: {
    salesGroup: <a href="./relationship-types/belongs-to.md">belongsTo</a>(),
    accounts:   <a href="./relationship-types/has-many.md">hasMany</a>(),
    todos:      hasMany().<a href="./relationship-types/has-many-through.md">through</a>()
  },
}
</pre>

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

### Terms 

- Source schema - The schema the definition is written in.
- Target schema - The schema the Source schema is establishing a relationship with.


### Schema.name

The schema name should be `Singular PascalCase` as follows:

```js
const SalesPerson = {
  name: "SalesPerson", //👀
  attributes: {
    firstName: "STRING" 
  }
}
```

**Database Implications:**

- Creates a table `sales_person`.

**API Implications:**

- This will create a `/sales-persons` API.
- When referencing this type in the `fields`, `SalesPerson` will be used: `GET /sales-persons?fields[SalesPerson]=name`
- `SalesPerson` will be used as the response `type`: `{data: {type: "SalesPerson"}}`

### Schema.pluralName

Set `pluralName` to configure plural naming for that type.  

```js
const SalesPerson = {
  name: "SalesPerson",
  pluralName: "SalesPeople", //👀
  attributes: {
    firstName: "STRING"
  }
}
```

**API Implications**

- Create a `/sales-people` API.

### Schema.namespace `postgres-only`
Set namespace when using Postgres to set use [Postgres Schema](https://www.postgresql.org/docs/current/ddl-schemas.html) which are like a namespace for tables. The namespace must be written as Singular PascalCase as follows:

```
const AcmeCorp_SalesPerson = {
  name: "SalesPerson",
  namespace: "AcmeCorp", //👀
  attributes: { ... }
}
```

**Database Implications**

- Creates a table sales_person in the Postgres schema acme_corp

**API Impliciations**

- This will create an acme-corp/sales-persons API
- When referencing this in the type fields, AcmeCorp_SalesPerson will be used: GET /acme-corp/sales-persons?fields[AcmeCorp_SalesPerson]=name
- Data will be returned like:
  ```
  {
    data: {
      type: "AcmeCorp_SalesPerson",  // same as in "included"
      id: "....",
      attributes: { .... }
    }
  }
  ```

**Returned Models Implications**

hatchifyKoa({AcmeCorp_SalesPerson}) returns models.AcmeCorp_SalesPerson


### Schema.attributes.ATTRIBUTE_NAME

An attribute name should be `Singular camelCase`.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING" //👀
  }
}
```

**Database Implications**

- Creates a column `first_name` in the `sales_person` table.

**API Implications**

- `firstName` will be used in query parameters like
  `GET /sales-persons?filter[firstName]=Mary&fields[SalePerson]=firstName`
- `firstName` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Mary" } //👀
    }
  }
  ```

### relationships.belongsTo

A `target` option is required.

- `target` should match a `Schema.name` and be _Singular PascalCase_.

```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{ target: "SalesPerson"}], //👀
}
```

**Database Implications**

- Creates a column `sales_person_id` column in the `account` table.

**API Implications**

- `salesPerson` will be used in the include query parameter like
  `GET /accounts?include=salesPerson`
- `salesPerson` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "Account",
      id: "1",
      attributes: { firstName: "Acme" },
      relationships: {
        salesPerson: {
          data: [ 
            { type: "SalesPerson", id: "322" } //👀 
          ]
        }          
      }
    }
  }
  ```


### relationships.belongsTo.as

`as` should be _Singular camelCase_.

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
        closerPerson: {
          data: [ 
            { type: "SalesPerson", id: "322" } //👀 
          ]
        }          
      }
    }
  }
  ```

### relationships.belongsTo.foreignKey

`foreignKey` sets the name of the relationship column. `foreignKey` should be _snake_case_.

> NOTE: `foreignKey` could reference a _camelCase_ attribute in the source schema.  


```js
const Account = {
  name: "Account",
  attributes: {
    name: "STRING",
  },
  belongsTo: [{
    target: "SalesPerson",
    options: { as: "closerPerson", foreignKey: "finisher_id" } //👀
  }],
}
```

**Database Implications**

- Creates a column `finisher_id` in the `account` table.

**API Implications**

There are no changes to the API.


### relationships.hasMany

`target`is required. `target` must match a `Schema.name` and be _Singular PascalCase_.


```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  hasMany: [
    { target: "Account" } //👀
  ],
}
```

**Database Implications**

- Assumes a column `sales_person_id` in the `account` table.

**API Implications**

- `accounts` will be used in the include query parameter like
  `GET /sales-persons?include=accounts`
- `accounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Mary" },
      relationships: {
        accounts: {
          data: [{type: "Account", id: "456"}]  //👀
        }
      }
    }
  }
  ```

### relationships.hasMany.as

`as` should be _Plural camelCase_.



```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  hasMany: [
    { target: "Account", options: { as: "managingAccounts" } } //👀
  ],
}
```

**Database Implications**

- Assumes a column `sales_person_id` in the `account` table.

**API Implications**

- `managingAccounts` will be used in the include query parameter like
  `GET /sales-persons?include=managingAccounts`
- `managingAccounts` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "SalesPerson",
      id: "1",
      attributes: { firstName: "Mary" },
      relationships: {
        managingAccounts: {
          data: [{type: "Account", id: "456"}] //👀
        } 
      }
    }
  }
  ```

### relationships.hasMany.foreignKey

`foreignKey` specifies the column used in the target schema that references:

- a _snake_case_ column name in the target table


> A _camelCase_ attribute name in the target schema can also be specified.

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

- Assumes a column `opening_sales_person_id` in the `account` table.

**API Implications**

This has no effect on the API.


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
      target: "Account", //👀
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
      attributes: { firstName: "Mary" },
      relationships: {
        accounts: { 
          data: [{type: "Account", id: "456"}] //👀
        } 
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
      options: { through: "SalesAccount" },
    },
  ],
}
```

**Database Implications**

- Assumes a `sales_account` table exists with `sales_person_id` and `account_id` columns.  

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
      attributes: { firstName: "Mary" },
      relationships: {
        salesAccounts: {
          data: [{type: "Account", id: "456"}] //👀
        } 
      }
    }
  }
  ```

### relationships.belongsToMany.options.foreignKey

`foreignKey` must be _singular snake_case_.

> `foreignKey` can also reference an attribute in the "Join" schema.

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
        foreignKey: "seller_id",
      }
    },
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
