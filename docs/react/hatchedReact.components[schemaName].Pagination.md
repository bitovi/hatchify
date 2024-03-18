# hatchedReact.components[schemaName].Pagination

The `Pagination` custom component allows you to manage the pagination of a list of items. It accepts an object with properties `meta`, `page`, and `setPage` and returns a `React.FC<XDataGridProps>`:

```tsx
const count = meta?.meta?.unpaginatedCount
    ? Math.ceil(meta.meta.unpaginatedCount / page.size)
    : 1

return (
    <Pagination
      disabled={meta?.isPending}
      css={styles.pagination}
      count={count}
      page={page.number}
      shape="rounded"
      variant="outlined"
      onChange={(ev: React.ChangeEvent<unknown>, value: number) =>
        setPage({ ...page, number: value })
      }
    />
)
```
