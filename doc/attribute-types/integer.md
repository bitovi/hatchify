# integer({min, max, references, default, required})

Defines an attribute as being an integer.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    importance: integer({ required: true }),
  }
}
```

## Parameters

- `default` [{Integer}] - The default value of the attribute.  Example: `integer({default: 10})`
- `max` [{Integer=Infinity}] - The maximum number allowed. Defaults to Infinity. Example: `integer({max: 1000})`
- `min` [{Integer=-Infinity}] - The minimum number of characters allowed.  Defaults to -Infinity. Example: `integer({min: 1})`
- `references` - [See References]()
- `required` [{Boolean=false}] - If the attribute must be provided.
- `step` [{Integer=1}] - If the granularity the value must adhere to. This number must be an integer itself. Example: `integer({step: 2})`

## Form Controls

`integer()` will produce a [`<input type="number" step="1">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/number) control. 


<details>
<summary>

## Advanced Details

</summary>

### Control Type

```js
{
  type: "Number",
  allowNull: Boolean, 
  step: 1,
  max: Infinity,
  min: -Infinity
}
```


### Sequelize Type

```js
{
 type: "INTEGER",
 typeArgs: [],
 allowNull: Boolean
}
```
  
</details>


