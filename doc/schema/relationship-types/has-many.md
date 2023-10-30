# hasMany( [schemaName][,{targetAttribute}] )

Creates a "has many" relationship from the source schema to the target schema. For each instance of the source schema, it will relate to multiple 
records of the target schema. 

## hasMany()

The relationship key must be the `camelCased plural` name of an existing model, otherwise `targetAttribute` must be provided. In the following example,
there must be a model with a plural name of `accounts`.

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  relationships: {
    accounts: hasMany()
  }
}
```

### Assembly Implications

This creates an `Account.salesPersonId` that  references `SalesPerson` as if it were defined below:

```js
const Account = {
  name: "Account",
  attributes: {
    salesPersonId: uuid({references: "SalesPerson"})
  }
}
```




<details>
<summary>Advanced Details</summary>

```js
const SalesPerson = {
  name: "SalesPerson",
  attributes: {
    firstName: "STRING",
  },
  relationships: {
    accounts: hasMany()
    // Immediate result
    accounts: {
     relationshipType: "hasMany",
     targetSchema: null,
     targetAttribute: null,
    }
    // After assembly
    accounts: {
     relationshipType: "hasMany",
     targetSchema: "Account",
     targetAttribute: "salesPersonId",
    }
  }
}
```
  
</details>



## hasMany(schemaName, {targetAttribute})
