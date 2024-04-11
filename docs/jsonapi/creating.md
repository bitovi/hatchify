# Creating Resources

A resource can be created by sending a POST request to a URL that represents a collection of resources. The request MUST include a single resource object as primary data. The resource object MUST contain at least a type member.

For instance, a new photo might be created with the following request:

```bash
POST /api/photos
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
  "data": {
    "type": "Photo",
    "attributes": {
      "title": "Ember Hamster",
      "src": "http://example.com/images/productivity.png"
    },
    "relationships": {
      "photographer": {
        "data": { "type": "Person", "id": "3997586b-b1e6-416c-88cf-1fd9a689b298" }
      }
    }
  }
}
```

If a relationship is provided in the relationships member of the resource object, its value MUST be a relationship object with a data member. The value of this key represents the linkage the new resource is to have.
