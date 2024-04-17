import type { FinalSchema } from "../types/index.js"

export function getSchemaKey(
  schema: Pick<FinalSchema, "name" | "namespace">,
): string {
  if (!schema) return schema

  const { name, namespace } = schema
  return !namespace ? name ?? "" : `${namespace}_${name ?? ""}`
}
