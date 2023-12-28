export function camelCaseToTitleCase(
  camelCaseString?: string,
): string | undefined {
  return typeof camelCaseString !== "string"
    ? camelCaseString
    : camelCaseString
        ?.replace(/([A-Z]|[0-9]+)/g, " $1")
        .replace(/^./, function (str) {
          return str.toUpperCase()
        })
}
