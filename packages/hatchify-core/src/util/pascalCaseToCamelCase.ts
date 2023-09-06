export function pascalCaseToCamelCase(pascalCaseString: string): string {
  return typeof pascalCaseString !== "string"
    ? pascalCaseString
    : pascalCaseString.charAt(0).toLowerCase() + pascalCaseString.slice(1)
}
