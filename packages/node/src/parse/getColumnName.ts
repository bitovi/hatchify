import { noCase } from "no-case"
import type { Dialect } from "sequelize"

export function getColumnName(attributeName: string, dialect: Dialect): string {
  if (!attributeName.includes(".")) {
    return noCase(attributeName, { delimiter: "_" })
  }

  const columnName = attributeName
    .replaceAll("$", "")
    .split(".")
    .map((part, index, { length }) =>
      index === length - 1 ? noCase(part, { delimiter: "_" }) : part,
    )
    .join(".")

  return dialect === "sqlite" ? `\`${columnName}\`` : `"${columnName}"`
}
