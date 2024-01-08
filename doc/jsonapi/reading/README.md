# Reading

- [Filtering](./filtering/README.md)
- [Paginating](./paginating/README.md)
- [Sorting](./sorting/README.md)
- [Relationships](./relationships/README.md)
- [Sparse Fields](./sparse-fields/README.md)

## Fetching Resources

Data, including resources and relationships, can be fetched by sending a GET request to an endpoint.

Responses can be further refined with the optional features described below.

A server MUST support fetching resource data for every URL provided as:

- a self link as part of the top-level links object
- a self link as part of a resource-level links object
- a related link as part of a relationship-level links object

For example, the following request fetches a collection of articles:

```
GET /api/articles HTTP/1.1
Accept: application/vnd.api+json
```

The following request fetches an article:

```
GET /api/articles/1 HTTP/1.1
Accept: application/vnd.api+json
```

And the following request fetches an article’s author:

```
GET /api/articles/1/author HTTP/1.1
Accept: application/vnd.api+json
```

A server MUST respond to a successful request to fetch an individual resource or resource collection with a 200 OK response.

A server MUST respond to a successful request to fetch a resource collection with an array of resource objects or an empty array ([]) as the response document’s primary data.

For example, a GET request to a collection of articles could return:

```
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json

{
  "links": {
    "self": "http://example.com/articles"
  },
  "data": [{
    "type": "articles",
    "id": "1",
    "attributes": {
      "title": "JSON:API paints my bikeshed!"
    }
  }, {
    "type": "articles",
    "id": "2",
    "attributes": {
      "title": "Rails is Omakase"
    }
  }]
}
```

A similar response representing an empty collection would be:

```
HTTP/1.1 200 OK
Content-Type: application/vnd.api+json

{
  "links": {
    "self": "http://example.com/articles"
  },
  "data": []
}
```

### Inclusion of Related Resources

An endpoint MAY return resources related to the primary data by default.

An endpoint MAY also support an include query parameter to allow the client to customize which related resources should be returned.

If an endpoint does not support the include parameter, it MUST respond with 400 Bad Request to any requests that include it.

If an endpoint supports the include parameter and a client supplies it:

The server’s response MUST be a compound document with an included key — even if that included key holds an empty array (because the requested relationships are empty).
The server MUST NOT include unrequested resource objects in the included section of the compound document.
The value of the include parameter MUST be a comma-separated (U+002C COMMA, “,”) list of relationship paths. A relationship path is a dot-separated (U+002E FULL-STOP, “.”) list of relationship names. An empty value indicates that no related resources should be returned.

If a server is unable to identify a relationship path or does not support inclusion of resources from a path, it MUST respond with 400 Bad Request.

Note: For example, a relationship path could be comments.author, where comments is a relationship listed under a articles resource object, and author is a relationship listed under a comments resource object.

For instance, comments could be requested with an article:

```
GET /api/articles/1?include=comments HTTP/1.1
Accept: application/vnd.api+json
```

In order to request resources related to other resources, a dot-separated path for each relationship name can be specified:

```
GET /api/articles/1?include=comments.author HTTP/1.1
Accept: application/vnd.api+json
```

Note: Because compound documents require full linkage (except when relationship linkage is excluded by sparse fieldsets), intermediate resources in a multi-part path must be returned along with the leaf nodes. For example, a response to a request for comments.author should include comments as well as the author of each of those comments.

Note: A server may choose to expose a deeply nested relationship such as comments.author as a direct relationship with an alternative name such as commentAuthors. This would allow a client to request /articles/1?include=commentAuthors instead of /articles/1?include=comments.author. By exposing the nested relationship with an alternative name, the server can still provide full linkage in compound documents without including potentially unwanted intermediate resources.

Multiple related resources can be requested in a comma-separated list:

```
GET /api/articles/1?include=comments.author,ratings HTTP/1.1
Accept: application/vnd.api+json
```

Furthermore, related resources can be requested from a relationship endpoint:

```
GET /api/articles/1/relationships/comments?include=comments.author HTTP/1.1
Accept: application/vnd.api+json
```

In this case, the primary data would be a collection of resource identifier objects that represent linkage to comments for an article, while the full comments and comment authors would be returned as included data.

Note: This section applies to any endpoint that responds with primary data, regardless of the request type. For instance, a server could support the inclusion of related resources along with a POST request to create a resource or relationship.

### Sparse Fieldsets

A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] query parameter.

The value of any fields[TYPE] parameter MUST be a comma-separated (U+002C COMMA, “,”) list that refers to the name(s) of the fields to be returned. An empty value indicates that no fields should be returned.

If a client requests a restricted set of fields for a given resource type, an endpoint MUST NOT include additional fields in resource objects of that type in its response.

If a client does not specify the set of fields for a given resource type, the server MAY send all fields, a subset of fields, or no fields for that resource type.

```
GET /api/articles?include=author&fields[Article]=title,body&fields[Author]=name HTTP/1.1
Accept: application/vnd.api+json
```

Note: The above example URI shows unencoded [ and ] characters simply for readability. In practice, these characters should be percent-encoded. See “Square Brackets in Parameter Names”.

Note: This section applies to any endpoint that responds with resources as primary or included data, regardless of the request type. For instance, a server could support sparse fieldsets along with a POST request to create a resource.

### Sorting

A server MAY choose to support requests to sort resource collections according to one or more criteria (“sort fields”).

`Note`: Although recommended, sort fields do not necessarily need to correspond to resource attribute and relationship names.

`Note`: It is recommended that dot-separated (U+002E FULL-STOP, “.”) sort fields be used to request sorting based upon relationship attributes. For example, a sort field of author.name could be used to request that the primary data be sorted based upon the name attribute of the author relationship.

An endpoint MAY support requests to sort the primary data with a sort query parameter. The value for sort MUST represent sort fields.

```
GET /api/people?sort=age HTTP/1.1
Accept: application/vnd.api+json
```

An endpoint MAY support multiple sort fields by allowing comma-separated (U+002C COMMA, “,”) sort fields. Sort fields SHOULD be applied in the order specified.

```
GET /api/people?sort=age,name HTTP/1.1
Accept: application/vnd.api+json
```

The sort order for each sort field MUST be ascending unless it is prefixed with a minus (U+002D HYPHEN-MINUS, “-“), in which case it MUST be descending.

```
GET /api/articles?sort=-created,title HTTP/1.1
Accept: application/vnd.api+json
```

The above example should return the newest articles first. Any articles created on the same date will then be sorted by their title in ascending alphabetical order.

If the server does not support sorting as specified in the query parameter sort, it MUST return 400 Bad Request.

If sorting is supported by the server and requested by the client via query parameter sort, the server MUST return elements of the top-level data array of the response ordered according to the criteria specified. The server MAY apply default sorting rules to top-level data if request parameter sort is not specified.

Note: This section applies to any endpoint that responds with a resource collection as primary data, regardless of the request type.

### Pagination

A server MAY choose to limit the number of resources returned in a response to a subset (“page”) of the whole set available.

A server MAY provide links to traverse a paginated data set (“pagination links”).

Pagination links MUST appear in the links object that corresponds to a collection. To paginate the primary data, supply pagination links in the top-level links object. To paginate an included collection returned in a compound document, supply pagination links in the corresponding links object.

The following keys MUST be used for pagination links:

first: the first page of data
last: the last page of data
prev: the previous page of data
next: the next page of data
Keys MUST either be omitted or have a null value to indicate that a particular link is unavailable.

Concepts of order, as expressed in the naming of pagination links, MUST remain consistent with JSON:API’s sorting rules.

The page query parameter family is reserved for pagination. Servers and clients SHOULD use these parameters for pagination operations.

`Note`: JSON API is agnostic about the pagination strategy used by a server, but the page query parameter family can be used regardless of the strategy employed. For example, a page-based strategy might use query parameters such as page[number] and page[size], while a cursor-based strategy might use page[cursor].

`Note`: This section applies to any endpoint that responds with a resource collection as primary data, regardless of the request type.

Filtering
The filter query parameter family is reserved for filtering data. Servers and clients SHOULD use these parameters for filtering operations.

`Note`: JSON API is agnostic about the strategies supported by a server.
