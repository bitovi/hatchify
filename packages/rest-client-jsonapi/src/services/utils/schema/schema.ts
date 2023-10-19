export const getEndpoint = (
  endpoint: string | undefined,
  namespace: string | undefined,
  pluralName: string | undefined,
  schemaName: string,
): string => {
  if (endpoint) {
    return endpoint
  }

  const namespacePrefix = namespace ? `${namespace}/` : ""

  if (pluralName) {
    return `${namespacePrefix}${pluralName
      .split(/(?=[A-Z])/)
      .join("-")}`.toLowerCase()
  }

  return `${namespacePrefix}${schemaName
    .split(/(?=[A-Z])/)
    .join("-")}s`.toLowerCase()
}
