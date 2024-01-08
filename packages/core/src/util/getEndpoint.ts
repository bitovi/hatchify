import { pascalCaseToKebabCase } from "./pascalCaseToKebabCase.js"
import { pluralize } from "./pluralize.js"
import type { FinalSchema } from "../types/index.js"

export function getEndpoint(
  schema: Pick<FinalSchema, "name" | "namespace" | "pluralName">,
): string | undefined {
  const { name, namespace } = schema
  const pluralName = pascalCaseToKebabCase(schema.pluralName ?? pluralize(name))
  return namespace
    ? `${pascalCaseToKebabCase(namespace)}/${pluralName}`
    : pluralName
}
