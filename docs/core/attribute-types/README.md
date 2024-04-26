# Attribute Types

Each schema can use different attribute types to describe the different data shapes it needs to store.

- [General Guidelines](#general-guidelines)
- [displayName](#displayname)
- [readOnly](#readonly)
- [Further Customizations](#further-customizations)

## General Guidelines

Attribute keys should be singular and camelCase:

```ts
// hatchify-app/schemas.ts
export const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(), // 👀
    lastName: string(),
    age: integer(),
    yearsWorked: integer({ displayName: "Years of Experience" }),
    hireDate: datetime(),
    bio: text(),
    status: enumerate({ values: ["active", "inactive"] }),
    isDeleted: boolean(),
    birthday: dateonly(),
    uniqueId: uuid(),
  },
} satisfies PartialSchema
```

### 💾 Database Implications

Creates columns `first_name`, `last_name`, `age`, etc. in the `sales_person` table.

### ↔️ API Implications

**_Querying Data_**

Creates a `/sales-persons` API.
`firstName` will be used in the query parameters:

```js
GET /api/sales-persons?fields[SalesPerson]=firstName
```

**_Data Response_**

`firstName` will be used in the mutation and response payloads:

```json
{
  "data": {
    "type": "SalesPerson",
    "id": "c98b2123-78e7-45e4-b57f-f9c1189bfd19",
    "attributes": {
      "firstName": "Mary" // 👀
    }
  }
}
```

## displayName

The `displayName` is an optional parameter that can be used to customize the display name of an individual attribute in the UI. If `displayName` is not set, then the attribute key will be transformed to Title Case.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
    lastName: string({ displayName: "Surname" }), // 👀
  },
} satisfies PartialSchema
```

### 💾 Database Implications

This has no effect on the database.

### ↔️ API Implications

This has no effect on the API.

### 🖼️ UI Implications

The `lastName` attribute will be displayed as "Surname" in the table header and filter dropdowns.

## readOnly

The `readOnly` is an optional parameter to prevent updates to the attribute using Hatchify.

```ts
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: string(),
    lastName: string({ readOnly: true }), // 👀
  },
} satisfies PartialSchema
```

### 💾 Database Implications

This will prevent updating the attribute via Hatchify.

### ↔️ API Implications

This will prevent updating the attribute via Hatchify.

### 🖼️ UI Implications

This has no effect on the UI.

## Further Customizations

Each of these types renders differently on the UI and have different customization options. For more reading:

- [Boolean](./boolean.md)
- [Date Only](./dateonly.md)
- [Date Time](./datetime.md)
- [Enumerate](./enum.md)
- [Integer](./integer.md)
- [Number](./number.md)
- [String](./string.md)
- [Text](./text.md)
- [UUID](./uuid.md)
