# belongsTo( [schemaName, options] )

`belongsTo()` creates a relationship from the current _source_ schema to the _target_ schema. The following makes each account
belong to a sales person:

```ts
const Account: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
}

const Account: PartialSchema = {
  name: "Account",
  attributes: {},
  relationships: {
    salesPerson: belongsTo(), // 👀
  },
}
```

The following walks through different signatures of `belongsTo()` and how they work.

## belongsTo()

The relationship key for `belongsTo()` called without any arguments MUST match the _camelCase_ name of another schema.

For example, `salesPerson` below matches `SalesPerson`:

```ts
const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
}

const Account: PartialSchema = {
  name: "Account",
  attributes: {},
  relationships: {
    salesPerson: belongsTo(), // 👀
  },
}
```

**Schema Implications**

An attribute named `salesPersonId` will be created as if it were defined as follows:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {
    salesPersonId: uuid({ references: "SalesPerson" }), // 👀
  },
  relationships: {
    salesPerson: belongsTo(),
  },
}
```

**Database Implications**

Creates a column `sales_person_id` in the `account` table.

**API Implications**

- `salesPerson` will be used in the include query parameter like `GET /accounts?include=salesPerson`
- `salesPerson` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "Account",
      id: "1",
      attributes: { firstName: "Acme" },
      relationships: {
        salesPerson: {type: "SalesPerson", id: "uuid-123"} //👀
      }
    }
  }
  ```

## belongsTo(schemaName)

Pass a `schemaName` to specify the related schema.

```ts
const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
}

const Account: PartialSchema = {
  name: "Account",
  attributes: {},
  relationships: {
    closingSalesPerson: belongsTo("SalesPerson"), // 👀
  },
}
```

**Schema Implications**

An attribute named `closingSalesPersonId` will be created as if it were defined as follows:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {
    closingSalesPersonId: uuid({ references: "SalesPerson" }), // 👀
  },
  relationships: {
    closingSalesPerson: belongsTo("SalesPerson"),
  },
}
```

**Database Implications**

Creates a column `closing_sales_person_id` in the `account` table.

**API Implications**

- `closingSalesPerson` will be used in the include query parameter like `GET /accounts?include=closingSalesPerson`
- `closingSalesPerson` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "Account",
      id: "1",
      attributes: { firstName: "Acme" },
      relationships: {
        closingSalesPerson: {type: "SalesPerson", id: "uuid-123"} //👀
      }
    }
  }
  ```

## belongsTo(schemaName,{sourceAttribute})

Pass a `sourceAttribute` to specify which attribute defines the relationship.

```ts
const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
}

const Account: PartialSchema = {
  name: "Account",
  relationships: {
    closingSalesPerson: belongsTo("SalesPerson", { sourceAttribute: "closerId" }), // 👀
  },
}
```

**Database Implications**

Creates a column `closer_id` in the `account` table.

**API Implications**

- `closingSalesPerson` will be used in the include query parameter like `GET /accounts?include=closingSalesPerson`
- `closingSalesPerson` will be used in mutation payloads and response payloads like:
  ```js
  {
    data: {
      type: "Account",
      id: "1",
      attributes: { firstName: "Acme", closerId: "uuid-123" },
      relationships: {
        closingSalesPerson: {type: "SalesPerson", id: "uuid-123"} //👀
      }
    }
  }
  ```
