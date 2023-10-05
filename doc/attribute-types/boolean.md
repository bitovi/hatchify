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


## Database and Sequelize

The `boolean` type will create a sequelize [DataTypes.BOOLEAN](https://sequelize.org/docs/v6/core-concepts/model-basics/#boolean) column.

## Service API

### Querying Data

For booleans, use `true`, `false`, and `null` in your queries as follows:

```js
GET /todos?complete=true  // all complete todos
GET /todos?complete=null  // all todos with null as the complete value
GET /todos?complete=false // all false todos
```

Checkout the [compatibility table](../filtering-data/filtering-data.md#compatibility) for what operators can be used with booleans.


### Data Response

### Mutating Data


## Service Response



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


