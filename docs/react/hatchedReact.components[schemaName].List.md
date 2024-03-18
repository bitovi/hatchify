# hatchedReact.components[schemaName].List

The `List` custom component is comprised of [MUI](https://mui.com/) components. It accepts an object of [`XDataGridProps`](types.md#xdatagridprops) and returns a `JSX.Element` with the following structure:

```tsx
<TableContainer style={{ maxHeight: height }}>
  <Table stickyHeader>
    <MuiHeaders {...props} columns={columns} />
    <MuiBody {...props} columns={columns} Empty={Empty} />
  </Table>
</TableContainer>
```
