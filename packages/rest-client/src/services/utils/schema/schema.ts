export function schemaNameIsString(schemaName: unknown): schemaName is string {
  return typeof schemaName === "string"
}

export class SchemaNameNotStringError extends Error {
  constructor(schemaName: unknown) {
    super(`Expected schemaName to be a string, received ${typeof schemaName}`)
  }
}
