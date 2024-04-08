export function isPathIncluded(
  flatIncludes: string[],
  relationshipPath: string[],
): boolean {
  if (relationshipPath.length < 2) {
    return true
  }

  if (
    !flatIncludes.includes(
      relationshipPath.slice(0, relationshipPath.length - 1).join("."),
    )
  ) {
    return false
  }

  if (relationshipPath.length === 2) {
    return true
  }

  return isPathIncluded(
    flatIncludes,
    relationshipPath.slice(0, relationshipPath.length - 1),
  )
}
