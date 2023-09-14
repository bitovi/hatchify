import { noCase } from "no-case"

export function getColumnName(attributeName: string): string {
  return attributeName
    .replaceAll("$", "")
    .split(".")
    .map((part) => noCase(part, { delimiter: "_" }))
    .join(".")
}
