export function camelCaseToStartCase(
  camelCaseString?: string,
): string | undefined {
  return typeof camelCaseString !== "string"
    ? camelCaseString
    : camelCaseString?.replace(/([A-Z])/g, " $1").replace(/^./, function (str) {
        return str.toUpperCase()
      })
}
