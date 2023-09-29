export const getEndpoint = (
  endpoint: string | undefined,
  pluralName: string | undefined,
  schemaName: string,
): string => {
  return (
    endpoint ||
    (pluralName
      ? pluralName
          .split(/(?=[A-Z])/)
          .join("-")
          .toLowerCase()
      : `${schemaName
          .split(/(?=[A-Z])/)
          .join("-")
          .toLowerCase()}s`)
  )
}
