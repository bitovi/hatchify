# hasMany(schemaName, options?)

`hasMany()` creates a relationship from the current _source_ schema to the _target_ schema. The following makes each sales person has many accounts:

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany("Account"), // 👀
  },
} satisfies PartialSchema
```

The following walks through different signatures of `hasMany()` and how they work.

## hasMany(schemaName)

Pass a `schemaName` to specify the related schema.

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccounts: hasMany("Account"), // 👀
  },
} satisfies PartialSchema
```

**_Schema Implications_**

An attribute named `salesPersonId` will be created as if it was defined as follows:

```ts
const Account = {
  name: "Account",
  attributes: {
    salesPersonId: uuid(), // References SalesPerson.id
  },
} satisfies PartialSchema
```

**_Database Implications_**

Creates a column `sales_person_id` in the `account` table.

**_API Implications_**

This has no effect on the API

**_Querying Data_**

`salesAccounts` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccounts`

**_Data Response_**

`salesAccounts` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "9bc9b6e4-0328-4874-b687-25f817d92434",
    "attributes": {},
    "relationships": {
      // 👀
      "salesAccounts": {
        "data": [
          {
            "type": "Account",
            "id": "75f706ee-ac71-483a-ae16-45254b66f7e1"
          }
        ]
      }
    }
  }
}
```

## hasMany(schemaName,{targetAttribute})

Pass a `targetAttribute` to specify which attribute defines the relationship.

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccounts: hasMany("Account", {
      targetAttribute: "accountId", // 👀
    }),
  },
} satisfies PartialSchema
```

**_Database Implications_**

Creates a column `account_id` in the `account` table.

**_API Implications_**

This has no effect on the API

**_Querying Data_**

`salesAccounts` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccounts`

**_Data Response_**

`salesAccounts` will be used in mutation payloads and response payloads like:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "9bc9b6e4-0328-4874-b687-25f817d92434",
    "attributes": {},
    "relationships": {
      // 👀
      "salesAccounts": {
        "data": [
          {
            "type": "Account",
            "id": "75f706ee-ac71-483a-ae16-45254b66f7e1"
          }
        ]
      }
    }
  }
}
```
