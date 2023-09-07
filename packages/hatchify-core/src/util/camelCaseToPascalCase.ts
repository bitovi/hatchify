export function camelCaseToPascalCase(camelCaseString: string): string {
  return typeof camelCaseString !== "string"
    ? camelCaseString
    : camelCaseString.charAt(0).toUpperCase() + camelCaseString.slice(1)
}
