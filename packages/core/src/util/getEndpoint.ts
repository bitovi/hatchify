import { pascalCaseToKebabCase } from "./pascalCaseToKebabCase"
import { pluralize } from "./pluralize"
import type { FinalSchema } from "../types"

export function getEndpoint(
  schema: Pick<FinalSchema, "name" | "namespace" | "pluralName">,
): string | undefined {
  const { name, namespace } = schema
  const pluralName = pascalCaseToKebabCase(schema.pluralName ?? pluralize(name))
  return namespace
    ? `${pascalCaseToKebabCase(namespace)}/${pluralName}`
    : pluralName
}
