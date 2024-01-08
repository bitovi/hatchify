# Creating Resources

A resource can be created by sending a POST request to a URL that represents a collection of resources. The request MUST include a single resource object as primary data. The resource object MUST contain at least a type member.

For instance, a new photo might be created with the following request:

```
POST /api/photos HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
  "data": {
    "type": "photos",
    "attributes": {
      "title": "Ember Hamster",
      "src": "http://example.com/images/productivity.png"
    },
    "relationships": {
      "photographer": {
        "data": { "type": "people", "id": "9" }
      }
    }
  }
}
```

If a relationship is provided in the relationships member of the resource object, its value MUST be a relationship object with a data member. The value of this key represents the linkage the new resource is to have.
