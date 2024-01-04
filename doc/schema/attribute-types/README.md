# Attribute Types

A single scheme could use different attribute types to describe the different data shapes it needs to store:

```typescript
// hatchify-app/schemas.ts
export const User = {
  name: "User",
  attributes: {
    name: string(),
    age: integer(),
    yearsWorked: integer(),
    hireDate: datetime(),
    bio: text(),
    status: enumerate({ values: ["active", "inactive"] }),
    isDeleted: boolean(),
    birthday: dateonly(),
    uniqueId: uuid(),
  },
} satisfies PartialSchema
```

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
