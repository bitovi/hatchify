import { snakeCase } from "lodash"
import type { Dialect } from "sequelize"

export function getSequelizeSchemaName(
  dialect: Dialect,
  namespace?: string,
): string | undefined {
  if (dialect !== "postgres") {
    return undefined
  }

  if (!namespace) {
    return "public"
  }

  return snakeCase(namespace)
}
