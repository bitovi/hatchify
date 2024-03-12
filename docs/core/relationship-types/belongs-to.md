# belongsTo(schemaName, options?)

`belongsTo()` creates a relationship from the current _source_ schema to the _target_ schema. The following makes each account
belong to a sales person:

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
} satisfies PartialSchema

const Account = {
  name: "Account",
  attributes: {},
  relationships: {
    salesPerson: belongsTo("SalesPerson"), // 👀
  },
} satisfies PartialSchema
```

The following walks through different signatures of `belongsTo()` and how they work.

## belongsTo(schemaName)

Pass a `schemaName` to specify the related schema.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
} satisfies PartialSchema

const Account = {
  name: "Account",
  attributes: {},
  relationships: {
    closingSalesPerson: belongsTo("SalesPerson"), // 👀
  },
} satisfies PartialSchema
```

**_Schema Implications_**

An attribute named `closingSalesPersonId` will be created as if it was defined as follows:

```ts
const Account = {
  name: "Account",
  attributes: {
    closingSalesPersonId: uuid(), // References SalesPerson.id
  },
  relationships: {
    closingSalesPerson: belongsTo("SalesPerson"),
  },
} satisfies PartialSchema
```

### 💾 Database Implications

Creates a column `closing_sales_person_id` in the `account` table.

### ↔️ API Implications

**_Querying Data_**

`closingSalesPerson` will be used in the include query parameter like `GET /api/accounts?include=closingSalesPerson`

**_Data Response_**

`closingSalesPerson` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "Account",
    "id": "75f706ee-ac71-483a-ae16-45254b66f7e1",
    "attributes": {
      "firstName": "Acme",
      "closingSalesPersonId": "9bc9b6e4-0328-4874-b687-25f817d92434"
    },
    "relationships": {
      // 👀
      "closingSalesPerson": {
        "data": {
          "type": "SalesPerson",
          "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
        }
      }
    }
  }
}
```

## belongsTo(schemaName,{sourceAttribute})

Pass a `sourceAttribute` to specify which attribute defines the relationship.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
} satisfies PartialSchema

const Account = {
  name: "Account",
  relationships: {
    closingSalesPerson: belongsTo("SalesPerson", {
      sourceAttribute: "closerId", // 👀
    }),
  },
} satisfies PartialSchema
```

### 💾 Database Implications

Creates a column `closer_id` in the `account` table.

### ↔️ API Implications

**_Querying Data_**

`closingSalesPerson` will be used in the include query parameter like `GET /api/accounts?include=closingSalesPerson`

**_Data Response_**

`closingSalesPerson` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "Account",
    "id": "75f706ee-ac71-483a-ae16-45254b66f7e1",
    "attributes": {
      "firstName": "Acme",
      "closerId": "9bc9b6e4-0328-4874-b687-25f817d92434" // 👀
    },
    "relationships": {
      // 👀
      "closingSalesPerson": {
        "data": {
          "type": "SalesPerson",
          "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
        }
      }
    }
  }
}
```
