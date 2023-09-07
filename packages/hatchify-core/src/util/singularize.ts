export function singularize(pluralName: string): string {
  if (typeof pluralName !== "string") {
    return pluralName
  }

  return pluralName.endsWith("s")
    ? pluralName.substring(0, pluralName.length - 1)
    : pluralName
}
