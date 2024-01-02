# hasMany(schemaName?, options?)

`hasMany()` creates a relationship from the current _source_ schema to the _target_ schema. The following makes each sales person has many accounts:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany(), // 👀
  },
}
```

The following walks through different signatures of `hasMany()` and how they work.

## hasMany()

The relationship key for `hasMany()` called without any arguments MUST match the _camelCase_ plural name of another schema.

For example, `accounts` below matches `Account`:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany(), // 👀
  },
}
```

**Schema Implications**

An attribute named `salesPersonId` will be created as if it was defined as follows:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {
    salesPersonId: uuid(), // References SalesPerson.id
  },
}
```

**Database Implications**

Creates a column `sales_person_id` in the `account` table.

**API Implications**

- `accounts` will be used in the include query parameter like `GET /api/sales-persons?include=accounts` 🛑
- `accounts` will be used in mutation payloads and response payloads like:

  ```json
  {
    "data": {
      "type": "SalesPerson",
      "id": "9bc9b6e4-0328-4874-b687-25f817d92434",
      "attributes": {},
      "relationships": {
        // 👀
        "accounts": {
          "data": [
            {
              "type": "SalesPerson",
              "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
            }
          ]
        }
      }
    }
  }
  ```

## hasMany(schemaName)

Pass a `schemaName` to specify the related schema.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccounts: hasMany("Account"), // 👀
  },
}
```

**Schema Implications**

An attribute named `salesPersonId` will be created as if it was defined as follows:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {
    salesPersonId: uuid(), // References SalesPerson.id
  },
}
```

**Database Implications**

Creates a column `sales_person_id` in the `account` table.

**API Implications**

- `salesAccounts` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccounts`
- `salesAccounts` will be used in mutation payloads and response payloads like:

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
              "type": "SalesPerson",
              "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
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
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccounts: hasMany("Account", {
      targetAttribute: "accountId", // 👀
    }),
  },
}
```

**Database Implications**

Creates a column `account_id` in the `account` table.

**API Implications**

- `salesAccounts` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccounts`
- `salesAccounts` will be used in mutation payloads and response payloads like:

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
              "type": "SalesPerson",
              "id": "9bc9b6e4-0328-4874-b687-25f817d92434"
            }
          ]
        }
      }
    }
  }
  ```
