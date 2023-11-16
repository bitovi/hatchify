import type { FinalSchema } from "../types"

export function getSchemaKey({
  name,
  namespace,
}: Pick<FinalSchema, "name" | "namespace">): string {
  return !namespace ? name ?? "" : `${namespace}_${name ?? ""}`
}
