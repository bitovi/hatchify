export function pascalCaseToKebabCase(
  pascalCaseString?: string,
): string | undefined {
  return typeof pascalCaseString !== "string"
    ? pascalCaseString
    : pascalCaseString
        ?.replace(
          /[A-Z\u00C0-\u00D6\u00D8-\u00DE]/g,
          (match) => "-" + match.toLowerCase(),
        )
        .substring(1)
}
