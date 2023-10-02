# datetime({min, max, references, default, required})

Defines an attribute as being a date type that includes the __time__.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    dueDate: datetime({ required: true }),
  }
}
```

Use [dateonly] for a date type without time.

## Parameters

- `default` [{ISODateString | DateNumber | Date}] - The default value of the attribute.  Example: `string({default: "USA"})`
- `max` [{DateString | DateNumber | Date = Infinity}] - The maximum date allowed. Defaults to allowing any maximum date.

  `max` can be set to an `ISODateString`. Example: `datetime({max: '2023-10-02T21:16:15.349Z'})`.

  `max` can be set to an `DateNumber`. Example: `datetime({max: 1696283660000})`.

  `max` can be set to a `Date`. Example: `datetime({max: new Date()})`.

- `min` [{DateString | DateNumber | Date = -Infinity}] - The minimum number of characters allowed.  Defaults to 0. Example: `string({max: 1})`
- `references` - [See References]()
- `required` [{Boolean=false}] - If the attribute must be provided.

## Form Controls

`string()` with `max` of 255 and less will produce a standard text input like: `<input type=text>`. 

`string()` with `max` of 256 and more will show a : `<textarea>`. 

If `required` is `false`, empty strings will be treated as `null` values.



<details>
<summary>

## Advanced Details

</summary>

### Control Type

```js
{
  type: "String",
  allowNull: true, 
 max: 255
}
```


### Sequelize Type

```js
{
 type: "STRING",
 typeArgs: [255],
 allowNull: true
}
```
  
</details>

