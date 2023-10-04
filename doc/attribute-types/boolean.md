# boolean({default, required})

Defines an attribute as being a boolean.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    complete: boolean({ required: true }),
  }
}
```

## Parameters

- `default` [{Boolean}] - The default value of the attribute.  Example: `boolean({default: true})`
- `required` [{Boolean=false}] - If the attribute must be provided.

## Form Controls

`boolean()` will produce a [`<input type=checkbox>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox) control. `null` will be treated as unchecked.


<details>
<summary>

## Advanced Details

</summary>

### Control Type

```js
{
  type: "Boolean",
  allowNull: Boolean, 
}
```


### Sequelize Type

```js
{
 type: "BOOLEAN",
 typeArgs: [],
 allowNull: Boolean
}
```
  
</details>


