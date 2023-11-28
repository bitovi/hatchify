# text({default, required})

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
- `required` [{Boolean=false}] - If the attribute must be provided.

|      key      | description                                                              | type            | optional  | default |
| ------------- | ------------------------------------------------------------------------ | :-------------: | :-------: | :-----: | 
| `default`     | The default value of the attribute. <br/> Example: `text({default: true})`  | `String`        | Yes       |         |
| `required`    | If the attribute must be provided.  <br/> Example: `text({required: true})` | `Boolean`       | Yes       | `false` |


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


