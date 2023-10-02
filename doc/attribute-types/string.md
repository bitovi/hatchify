# string({min, max, references, default, required})

Defines an attribute as being a string type.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
  }
}
```

## Parameters

- `default` [{String}] - The default value of the attribute.  Example: `string({default: "USA"})`
- `max` [{Number=225}] - The maximum number of characters allowed. Defaults to 255. Example: `string({max: 1023})`
- `min` [{Number=0}] - The minimum number of characters allowed.  Defaults to 0. Example: `string({max: 1})`
- `references` - [See References]()
- `required` [{Boolean=false}] - If the attribute must be provided.
