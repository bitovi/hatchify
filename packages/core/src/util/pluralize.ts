export function pluralize(singularName: string): string {
  if (typeof singularName !== "string") {
    return singularName
  }

  return singularName + "s"
}
