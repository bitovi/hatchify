# Deleting Resources

A resource can be deleted by sending a DELETE request to the URL that represents the resource:

```
DELETE /api/photos/1 HTTP/1.1
Accept: application/vnd.api+json
```

### Responses

`200 OK`: A server MAY return a 200 OK response with a document that contains no primary data if a deletion request is successful. Other top-level members, such as meta, could be included in the response document.
