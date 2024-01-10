# hasMany(schemaName, options?).through(schemaName?, options?)

`hasMany().through()` creates a relationship from the current _source_ schema to the _target_ schema through a _through_ schema. The following makes each sales person has many accounts:

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany("Account").through(), // 👀
  },
} satisfies PartialSchema
```

The following walks through different signatures of `hasMany().through()` and how they work.

## hasMany(schemaName)

Pass a `schemaName` to specify the target schema.

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    salesAccounts: hasMany("Account").through(), // 👀
  },
} satisfies PartialSchema
```

### Schema Implications

A schema named `AccountSalesPerson` will be created as if it was defined as follows:

```ts
const AccountSalesPerson = {
  name: "AccountSalesPerson",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
} satisfies PartialSchema
```

### Database Implications

Creates a table `account_sales_person` with `account_id` and `sales_person_id` columns.

### API Implications

#### Querying Data

`salesAccounts` and `accountSalesPersons` will be used in the include query parameter like `GET /api/sales-persons?include=salesAccounts,accountSalesPersons` 🛑

#### Data Response

`salesAccounts` and `accountSalesPersons` will be used in mutation payloads and response payloads like:

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

## hasMany(schemaName).through(schemaName)

Pass a `schemaName` to specify the join schema.

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany("Account").through("Assignments"), // 👀
  },
} satisfies PartialSchema
```

### Schema Implications

A schema named `Assignments` will be created as if it was defined as follows:

```ts
const Assignments = {
  name: "Assignments",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
} satisfies PartialSchema
```

### Database Implications

Creates a table `assignment` with `account_id` and `sales_person_id` columns.

### API Implications

#### Querying Data

`accounts` and `assignments` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,assignments` 🛑

#### Data Response

`accounts` and `assignments` will be used in mutation payloads and response payloads like:

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
            "type": "Account",
            "id": "75f706ee-ac71-483a-ae16-45254b66f7e1"
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

## hasMany(schemaName).through(schemaName, {throughTargetAttribute, throughSourceAttribute})

Pass attribute names to describe the join schema.

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany("Account").through("Assignments", { throughTargetAttribute: "theAccountId", throughSourceAttribute: "theSalesPersonId" }), // 👀
  },
} satisfies PartialSchema
```

### Schema Implications

A schema named `Assignments` will be created as if it was defined as follows:

```ts
const Assignments = {
  name: "Assignments",
  attributes: {
    theAccountId: uuid(), // References Account.id
    theSalesPersonId: uuid(), // References SalesPerson.id
  },
} satisfies PartialSchema
```

### Database Implications

Creates a table `assignment` with `the_account_id` and `the_sales_person_id` columns.

### API Implications

#### Querying Data

`accounts` and `assignments` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,assignments` 🛑

#### Data Response

`accounts` and `assignments` will be used in mutation payloads and response payloads like:

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
            "type": "Account",
            "id": "75f706ee-ac71-483a-ae16-45254b66f7e1"
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

## hasMany(schemaName).through(schemaName, {targetKey, sourceKey})

Pass a `targetKey` and `sourceKey` to specify which attributes define the relationship.

```ts
const Account = {
  name: "Account",
  attributes: {},
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {},
  relationships: {
    accounts: hasMany("Account").through("Assignments", { targetKey: "accountId", sourceKey: "salesPersonId" }), // 👀
  },
} satisfies PartialSchema
```

### Schema Implications

A schema named `Assignments` will be created and schemas will be updated as if they were defined as follows:

```ts
const Assignments = {
  name: "Assignments",
  attributes: {
    accountId: uuid(), // References Account.id
    salesPersonId: uuid(), // References SalesPerson.id
  },
} satisfies PartialSchema

const Account = {
  name: "Account",
  attributes: {
    accountId: uuid(), // References Assignments.accountId
  },
} satisfies PartialSchema

const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    salesPersonId: uuid(), // References Assignments.salesPersonId
  },
  relationships: {
    accounts: hasMany("Account").through("Assignments", { targetKey: "accountId", sourceKey: "salesPersonId" }), // 👀
  },
} satisfies PartialSchema
```

### Database Implications

Creates a table `assignment` with `account_id` and `sales_person_id` columns.
Creates a column `account_id` in the `account` table.
Creates a column `sales_person_id` in the `sales_person` table.

### API Implications

#### Querying Data

`accounts` and `assignments` will be used in the include query parameter like `GET /api/sales-persons?include=accounts,assignments` 🛑

#### Data Response

`accounts` and `assignments` will be used in mutation payloads and response payloads like:

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
            "type": "Account",
            "id": "75f706ee-ac71-483a-ae16-45254b66f7e1"
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
