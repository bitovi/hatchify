export const getEndpoint = (
  pluralName: string | undefined,
  schemaName: string,
): string => {
  return pluralName
    ? pluralName
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase()
    : `${schemaName
        .split(/(?=[A-Z])/)
        .join("-")
        .toLowerCase()}s`
}
