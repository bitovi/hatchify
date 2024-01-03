# hasOne(schemaName, options?)

`hasOne()` creates a relationship from the current _source_ schema to the _target_ schema. The following makes each sales person has one account:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    account: hasOne(), // 👀
  },
} satisfies PartialSchema
```

The following walks through different signatures of `hasOne()` and how they work.

## hasOne(schemaName)

Pass a `schemaName` to specify the related schema.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccount: hasOne("Account"), // 👀
  },
} satisfies PartialSchema
```

**Schema Implications**

An attribute named `salesPersonId` will be created as if it was defined as follows:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {
    salesPersonId: uuid(), // References SalesPerson.id
  },
} satisfies PartialSchema
```

**Database Implications**

Creates a column `sales_person_id` in the `account` table.

**API Implications**

- `salesAccount` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccount`
- `salesAccount` will be used in mutation payloads and response payloads like:

  ```json
  {
    "data": {
      "type": "SalesPerson",
      "id": "9bc9b6e4-0328-4874-b687-25f817d92434",
      "attributes": {},
      "relationships": {
        // 👀
        "salesAccount": {
          "data": {
            "type": "SalesPerson",
            "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
          }
        }
      }
    }
  }
  ```

## hasOne(schemaName,{targetAttribute})

Pass a `targetAttribute` to specify which attribute defines the relationship.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccount: hasOne("Account", {
      targetAttribute: "accountId", // 👀
    }),
  },
} satisfies PartialSchema
```

**Database Implications**

Creates a column `account_id` in the `account` table.

**API Implications**

- `salesAccount` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccount`
- `salesAccount` will be used in mutation payloads and response payloads like:

  ```json
  {
    "data": {
      "type": "SalesPerson",
      "id": "9bc9b6e4-0328-4874-b687-25f817d92434",
      "attributes": {},
      "relationships": {
        // 👀
        "salesAccount": {
          "data": {
            "type": "SalesPerson",
            "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
          }
        }
      }
    }
  }
  ```
