# string({min, max, references, default, required})

Defines an attribute as being a string type.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    name: string({ required: true }),
  },
}
```

## Querying Data

If `required` is `false`, filtering `null` values is handled like the following:

```
GET /todos?name=foo  // all todos with name foo
GET /todos?name=%00  // all todos with null as the name value 🛑
GET /todos?name=null  // all todos with "null" as the name value
```

### Data Response

String data will be returned as a string value or `null` as follows:

```js
{
  data: {
    ...
    attributes: {
      name: "foo" // or null
    }
  }
}
```

### Mutating Data

When creating or updating a string attribute, string value or `null` must be provided. Any other value will return a service error.

## Parameters

- `default` [{String}] - The default value of the attribute. Example: `string({default: "USA"})`
- `max` [{Number=225}] - The maximum number of characters allowed. Defaults to 255. Example: `string({max: 1023})`
- `min` [{Number=0}] - The minimum number of characters allowed. Defaults to 0. Example: `string({min: 1})`
- `references` - [See References]()
- `required` [{Boolean=false}] - If the attribute must be provided.

## Form Controls

`string()` with `max` of 255 and less will produce a standard text input like: `<input type=text>`.

`string()` with `max` of 256 and more will show a : `<textarea>`.

If `required` is `false`, empty strings will be treated as `null` values.
