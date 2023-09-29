import { isISO8601DatetimeString } from "@hatchifyjs/core"
import type { Dialect, FindOptions } from "sequelize"

import type { QueryStringParser } from "./builder"
import { walk } from "./walk"

function iso8601ToRfc3339(iso8601String: string): string {
  return iso8601String.replace("T", " ").replace("Z", " +00:00")
}

// Date nested columns do not format correctly for SQLite
export function handleSqliteDateNestedColumns(
  ops: QueryStringParser<FindOptions>,
  dialect: Dialect,
): QueryStringParser<FindOptions> {
  if (dialect !== "sqlite") {
    return ops
  }

  const where = walk(ops.data.where, (key, value) => {
    if (Array.isArray(value)) {
      return [
        value.map((item) =>
          isISO8601DatetimeString(item) ? iso8601ToRfc3339(item) : item,
        ),
        key,
      ]
    }

    if (typeof value !== "string") {
      return [null, key]
    }

    if (isISO8601DatetimeString(value)) {
      return [iso8601ToRfc3339(value), key]
    }

    return [null, key]
  })

  return {
    ...ops,
    data: {
      ...ops.data,
      where,
    },
  }
}
