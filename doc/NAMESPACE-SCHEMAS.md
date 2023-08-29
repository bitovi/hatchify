# Using Namespace Schemas with Postgres

This guide explains how to use Hatchify `namespace` property to create Postgres schemas.


## Define models with namespaces

To add a schema to a namespace, a key called `namespace` shoud be added to a schema definition, with a string value following PascalCase convention for example `AstraZeneca`.


```javaScript
User = {
  name:  "User",
  namespace:  "AstraZeneca",
  attributes: {
    name:  "STRING",
    lastname:  "STRING",
  }
}
```

For example, to create 2 namespaces **AstraZeneca** and **Pfizer** with each having a **User** and a **Todo** Models, all we have to do is add `namespace` property to each model schema.

By default if the `namespace` is not given, it will default to `public` namespace. 


```javaScript
const Schemas = {
  // AstraZeneca namespace schemas
  "AstraZeneca.User": {
    name: "User",
    namespace: "AstraZeneca",
    attributes: {
      name: STRING,
      // attributes here
    }
  }
  "AstraZeneca.Todo": {
    name: "Todo",
    namespace: "AstraZeneca",
    attributes: {
      title: "STRING",
      // attributes here
    }
  },

// Pfizer schemas, could be put in their own file
  "Pfizer.User": {
    name: "User",
    namespace: "Pfizer",
    attributes: {
      name: STRING,
      // attributes here
    }
  },
  "Bar.Todo": {
    name: "Todo",
    namespace: "Pfizer",
    attributes: {
      title: "STRING",
      // attributes here
    },
    belongsTo: [{ target: "User"}],
  }
}

//...

const hatchedKoa = hatchifyKoa(Object.values(Schemas), {
    prefix: `/api/`,
  })
```

**Database Implications**

- Creates `AstraZeneca.user`, `AstraZeneca.todo`, `pfizer.user`, and `pfizer.todo` tables with their related columns coming from `attributes` keys like `name` and `title`.

**API implications**

To call the created API end-point remember the Service URL path names are `kebab-case`.  (Ex: `/astra-zeneca`)

 _Note: Query parameters are `camelCase`._

```
GET /api/[namespace-name]/[schema]
```

In our example, to get all Users of ***AstraZeneca*** we do:

```
GET /api/astra-zeneca/users
```

To include fields we can do:


```
GET /api/astra-zeneca/todos?fields[AstraZeneca.Todo]=title
```
_Note: When refering to fields that belongs to the same namespace we could omit that namespace like:_

```
GET /api/astra-zeneca/todos?fields[Todo]=title
```
***IMPORTANT*** If there is at least one defined namespace, then the rest of the schemas with no defined namespaces would default to public namespace, which means an API call to one of them would look like (notice *public*):

```
GET /api/public/todos
```

**Returned values**

An example call like the following:

```
GET api/astra-zeneca/todos HTTP/1.1
Accept: application/vnd.api+json
```

Should return:

```
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json

{
  "links": {
    "self": "http://example.com/api/astra-zeneca/todos"
  },
  "data": [{
    "type": "todos",
    "namespace": "AstraZeneca",
    "id": "1",
    "attributes": {
      "title": "Call supply"
    }
  }, {
    "type": "todos",
    "namespace": "AstraZeneca",
    "id": "2",
    "attributes": {
      "title": "Check Emails"
    }
  }]
}
```
