export function isISO8601DateString(string: string): boolean {
  if (!/\d{4}-\d{2}-\d{2}/.test(string)) {
    return false
  }

  const date = new Date(string)

  return (
    date instanceof Date &&
    !isNaN(date.getTime()) &&
    date.toISOString() === `${string}T00:00:00.000Z`
  )
}
