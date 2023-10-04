# text({min, default, required})

Defines an attribute as having unlimited text length.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    description: text({ required: true }),
  }
}
```

## Parameters

- `default` [{String}] - The default value of the attribute.  Example: `text({default: "hello"})`
- ❓ `max` 
- `min` [{Number=0}] - The minimum number of characters allowed.  Defaults to 0. Example: `text({min: 1})`
- `required` [{Boolean=false}] - If the attribute must be provided.

## Form Controls

`text()` will produce a [`<textarea>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea) control. 


<details>
<summary>

## Advanced Details

</summary>

### Control Type

```js
{
  type: "String",
  allowNull: Boolean, 
  max: Infinity,
  min: 0
}
```


### Sequelize Type

```js
{
 type: "TEXT",
 typeArgs: [],
 allowNull: Boolean
}
```
  
</details>


