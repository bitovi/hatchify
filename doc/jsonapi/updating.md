# Updating Resources

A resource can be updated by sending a PATCH request to the URL that represents the resource.

The URL for a resource can be obtained in the self link of the resource object. Alternatively, when a GET request returns a single resource object as primary data, the same request URL can be used for updates.

The PATCH request MUST include a single resource object as primary data. The resource object MUST contain type and id members.

For example:

```
PATCH /api/articles/1 HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
  "data": {
    "type": "Article",
    "id": "8ff0beed-2585-4391-8735-cc560eaf287e",
    "attributes": {
      "title": "To TDD or Not"
    }
  }
}
```

### Updating a Resource’s Attributes

Any or all of a resource’s attributes MAY be included in the resource object included in a PATCH request.

If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.

For example, the following PATCH request is interpreted as a request to update only the title and text attributes of an article:

```
PATCH /api/articles/1 HTTP/1.1
Content-Type: application/vnd.api+json
Accept: application/vnd.api+json

{
  "data": {
    "type": "Article",
    "id": "8ff0beed-2585-4391-8735-cc560eaf287e",
    "attributes": {
      "title": "To TDD or Not",
      "text": "TLDR; It's complicated... but check your test coverage regardless."
    }
  }
}
```
