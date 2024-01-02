# hasMany(schemaName?, options?).through(schemaName?, options?)

`hasMany().through()` creates a relationship from the current _source_ schema to the _target_ schema through a _through_ schema. The following makes each sales person has many accounts:

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany().through(), // 👀
  },
}
```

The following walks through different signatures of `hasMany().through()` and how they work.

## hasMany().through()

The relationship key for `hasMany().through()` called without any arguments MUST match the _camelCase_ plural name of another schema.

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
    accounts: hasMany().through(), // 👀
  },
}
```

**Schema Implications**

A schema named `AccountSalesPerson` will be created as if it was defined as follows:

```ts
const AccountSalesPerson: PartialSchema = {
  name: "AccountSalesPerson",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
}
```

**Database Implications**

Creates a table `account_sales_person` with `account_id` and `sales_person_id` columns.

**API Implications**

- `accounts` and `accountSalesPersons` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,accountSalesPersons` 🛑
- `accounts` and `accountSalesPersons` will be used in mutation payloads and response payloads like:

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
        },
        // 👀
        "accountSalesPersons": {
          "data": [
            {
              "type": "AccountSalesPerson",
              "id": "dd5f522c-f912-4224-89be-977b7fac113c"
            }
          ]
        }
      }
    }
  }
  ```

## hasMany(schemaName)

Pass a `schemaName` to specify the target schema.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccounts: hasMany("Account").through(), // 👀
  },
}
```

**Schema Implications**

A schema named `AccountSalesPerson` will be created as if it was defined as follows:

```ts
const AccountSalesPerson: PartialSchema = {
  name: "AccountSalesPerson",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
}
```

**Database Implications**

Creates a table `account_sales_person` with `account_id` and `sales_person_id` columns.

**API Implications**

- `salesAccounts` and `accountSalesPersons` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccounts,accountSalesPersons` 🛑
- `salesAccounts` and `accountSalesPersons` will be used in mutation payloads and response payloads like:

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
        },
        // 👀
        "accountSalesPersons": {
          "data": [
            {
              "type": "AccountSalesPerson",
              "id": "dd5f522c-f912-4224-89be-977b7fac113c"
            }
          ]
        }
      }
    }
  }
  ```

## hasMany().through(schemaName)

Pass a `schemaName` to specify the join schema.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany().through("Assignments"), // 👀
  },
}
```

**Schema Implications**

A schema named `Assignments` will be created as if it was defined as follows:

```ts
const Assignments: PartialSchema = {
  name: "Assignments",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
}
```

**Database Implications**

Creates a table `assignment` with `account_id` and `sales_person_id` columns.

**API Implications**

- `accounts` and `assignments` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,assignments` 🛑
- `accounts` and `assignments` will be used in mutation payloads and response payloads like:

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
        },
        // 👀
        "assignments": {
          "data": [
            {
              "type": "AccountSalesPerson",
              "id": "dd5f522c-f912-4224-89be-977b7fac113c"
            }
          ]
        }
      }
    }
  }
  ```

## hasMany().through(schemaName, {throughTargetAttribute, throughSourceAttribute})

Pass attribute names to describe the join schema.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany().through("Assignments", { throughTargetAttribute: "theAccountId", throughSourceAttribute: "theSalesPersonId" }), // 👀
  },
}
```

**Schema Implications**

A schema named `Assignments` will be created as if it was defined as follows:

```ts
const Assignments: PartialSchema = {
  name: "Assignments",
  attributes: {
    theAccountId: uuid(), // References Account.id
    theSalesPersonId: uuid(), // References SalesPerson.id
  },
}
```

**Database Implications**

Creates a table `assignment` with `the_account_id` and `the_sales_person_id` columns.

**API Implications**

- `accounts` and `assignments` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,assignments` 🛑
- `accounts` and `assignments` will be used in mutation payloads and response payloads like:

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
        },
        // 👀
        "assignments": {
          "data": [
            {
              "type": "AccountSalesPerson",
              "id": "dd5f522c-f912-4224-89be-977b7fac113c"
            }
          ]
        }
      }
    }
  }
  ```

## hasMany().through(schemaName, {targetKey, sourceKey})

Pass a `targetKey` and `sourceKey` to specify which attributes define the relationship.

```ts
const Account: PartialSchema = {
  name: "Account",
  attributes: {},
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany().through("Assignments", { targetKey: "accountId", sourceKey: "salesPersonId" }), // 👀
  },
}
```

**Schema Implications**

A schema named `Assignments` will be created and schemas will be updated as if they were defined as follows:

```ts
const Assignments: PartialSchema = {
  name: "Assignments",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
}

const Account: PartialSchema = {
  name: "Account",
  attributes: {
    accountId: uuid(), // References Assignments.accountId
  },
}

const SalesPerson: PartialSchema = {
  name: "SalesPerson",
  attributes: {
    salesPersonId: uuid(), // References Assignments.salesPersonId
  },
  relationships: {
    accounts: hasMany().through("Assignments", { targetKey: "accountId", sourceKey: "salesPersonId" }), // 👀
  },
}
```

**Database Implications**

Creates a table `assignment` with `account_id` and `sales_person_id` columns.
Creates a column `account_id` in the `account` table.
Creates a column `sales_person_id` in the `sales_person` table.

**API Implications**

- `accounts` and `assignments` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,assignments` 🛑
- `accounts` and `assignments` will be used in mutation payloads and response payloads like:

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
        },
        // 👀
        "assignments": {
          "data": [
            {
              "type": "AccountSalesPerson",
              "id": "dd5f522c-f912-4224-89be-977b7fac113c"
            }
          ]
        }
      }
    }
  }
  ```
