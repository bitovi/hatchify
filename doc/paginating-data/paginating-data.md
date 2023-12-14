# Learn how to paginate data

This guide shows how to paginate data with Hatchify.

- [Pagination Techniques](#pagination-techniques)
- [Offset and Limit Pagination](#offset-and-limit-pagination)
- [Page-Based Pagination](#page-based-pagination)

## Pagination Techniques

Hatchify's middleware supports multiple pagination techniques. For example, the following url asks for the first 5 todos:

```curl
GET /api/todos?page[limit]=5
```

## Offset and Limit Pagination

This technique involves using two parameters: `page[offset]` and `page[limit]`. The `page[offset]` parameter determines the starting point or position in the dataset, while the `page[limit]` parameter specifies the maximum number of records to include on each page.

For example, the following url asks for 10 todos, skipping the first 5:

```curl
GET /api/todos?page[offset]=5&page[limit]=10
```

## Page-Based Pagination

Page-based pagination involves using a `page[number]` parameter to specify the desired page number. The API consumer requests a specific page of data, and the API responds with the corresponding page, typically along with metadata such as the total number of pages or total record count.

This technique simplifies navigation and is often combined with other parameters like `page[size]` to determine the number of records per page.

For example, the following url asks for the second page of todos where each page has 20 results:

```curl
GET /api/todos?page[number]=2&page[size]=20
```
