export function getFullModelName({
  name,
  namespace,
}: {
  name: string
  namespace?: string
}): string {
  return !namespace ? name : `${namespace}_${name}`
}
