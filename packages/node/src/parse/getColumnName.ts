import { snakeCase } from "lodash"
import type { Dialect } from "sequelize"

export function getColumnName(
  attributeName: string,
  escapeStyle?: Dialect,
): string {
  if (!attributeName.includes(".")) {
    return snakeCase(attributeName)
  }

  const columnName = attributeName
    .replaceAll("$", "")
    .split(".")
    .map((part, index, { length }) =>
      index === length - 1 ? snakeCase(part) : part,
    )
    .join(".")

  if (escapeStyle === "sqlite") {
    return `\`${columnName}\``
  }
  if (escapeStyle === "postgres") {
    return `"${columnName}"`
  }
  return columnName
}
