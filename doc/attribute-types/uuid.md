# uuid({references, required, autoIncrement})

Defines an attribute as being an string UUID4 value.

```ts
export const Todo: PartialSchema = {
  name: "Todo",
  attributes: {
    ownerId: uuid({ required: true }),
  }
}
```

## Parameters

- `autoIncrement` [{Boolean=false}] - If `true`, sets the field automatically to a unique uuid. Example: `uuid({autoIncrement: true})`
- `references` - [See References]()
- `required` [{Boolean=false}] - If the attribute must be provided.

## Form Controls

`uuid()` will produce a `<button>` that when clicked, will genereate a UUID in a `<input type='text'/>` control. Users can also provide their 
own UUID.  


<details>
<summary>

## Advanced Details

</summary>

### Control Type

```js
{
  type: "UUID4",
  allowNull: Boolean, 
}
```


### Sequelize Type

```js
{
 type: "STRING",
  typeArgs: [36],
  allowNull: true,
}
```
  
</details>


