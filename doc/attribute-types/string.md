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


