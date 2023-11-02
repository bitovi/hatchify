export function validateValues(values: readonly string[]): boolean {
  return (
    Array.isArray(values) &&
    values.length !== 0 &&
    values.every((value) => typeof value === "string")
  )
}
