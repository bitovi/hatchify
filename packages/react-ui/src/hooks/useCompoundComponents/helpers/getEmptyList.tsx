export function getEmptyList(childArray: JSX.Element[]): () => JSX.Element {
  const emptyComponent = childArray.find(
    (c) => c.type.name === "Empty" || c.type.displayName === "Empty",
  )
  const emptyDisplay: JSX.Element = emptyComponent?.props.children || undefined

  const EmptyList = () => emptyDisplay || <div>No records found</div>

  return EmptyList
}
