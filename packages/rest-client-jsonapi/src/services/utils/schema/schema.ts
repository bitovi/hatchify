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
    console.log("pluralName", pluralName)
    const namespacePrefix = namespace ? `${namespace}/` : ""
    return (
      namespacePrefix + pluralName.split(/(?=[A-Z])/).join("-")
    ).toLowerCase()
  }

  if (namespace) {
    console.log("namespace", schemaName, namespace)
    const [namespacePrefix, rest] = schemaName.split(/_(.*)/)
    return `${namespacePrefix}/${rest
      .split(/(?=[A-Z])/)
      .join("-")}s`.toLowerCase()
  }

  console.log("schemaName", schemaName)
  return `${schemaName
    .split(/(?=[A-Z])/)
    .join("-")
    .toLowerCase()}s`
}
