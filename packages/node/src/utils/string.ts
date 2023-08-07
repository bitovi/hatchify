export function pascalCaseToSnakeCase(text: string): string {
  return text
    .replace(/\.?([A-Z]+)/g, function (x, y) {
      return "_" + y.toLowerCase()
    })
    .replace(/^_/, "")
}
