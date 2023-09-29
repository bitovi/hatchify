export const getEndpoint = (
  endpoint: string | undefined,
  namespace: string | undefined,
  pluralName: string | undefined,
  schemaName: string,
): string => {
  if (endpoint) {
    return endpoint
  }

  if (pluralName) {
    const namespacePrefix = namespace ? `${namespace}_` : ""
    return (
      namespacePrefix + pluralName.split(/(?=[A-Z])/).join("-")
    ).toLowerCase()
  }

  if (namespace) {
    const [namespacePrefix, rest] = schemaName.split(/_(.*)/)
    return `${namespacePrefix}_${rest
      .split(/(?=[A-Z])/)
      .join("-")}s`.toLowerCase()
  }

  return `${schemaName
    .split(/(?=[A-Z])/)
    .join("-")
    .toLowerCase()}s`
}
