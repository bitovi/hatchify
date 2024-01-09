import type { FinalSchema } from "../types/index.js"

export function getSchemaKey({
  name,
  namespace,
}: Pick<FinalSchema, "name" | "namespace">): string {
  return !namespace ? name ?? "" : `${namespace}_${name ?? ""}`
}
