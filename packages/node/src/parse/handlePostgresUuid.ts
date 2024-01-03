import { isISO8601DateString, isISO8601DatetimeString } from "@hatchifyjs/core"
import type { Dialect, FindOptions } from "sequelize"
import { Op, Sequelize } from "sequelize"

import type { QueryStringParser } from "./builder.js"
import { getColumnName } from "./getColumnName.js"
import { walk } from "./walk.js"

function isString(string: string): boolean {
  return (
    typeof string === "string" &&
    !isISO8601DatetimeString(string) &&
    !isISO8601DateString(string)
  )
}

function parse(value: unknown): {
  operator?: typeof Op.eq | typeof Op.iLike | typeof Op.like
  innerValue?: string
} {
  if (isString((value as { [Op.eq]: any })[Op.eq])) {
    return {
      operator: Op.eq,
      innerValue: (value as { [Op.eq]: any })[Op.eq],
    }
  }

  if (isString((value as { [Op.iLike]: any })[Op.iLike])) {
    return {
      operator: Op.iLike,
      innerValue: (value as { [Op.iLike]: any })[Op.iLike],
    }
  }

  if (isString((value as { [Op.like]: any })[Op.like])) {
    return {
      operator: Op.like,
      innerValue: (value as { [Op.like]: any })[Op.like],
    }
  }

  return {}
}

export function handlePostgresUuid(
  ops: QueryStringParser<FindOptions>,
  dialect: Dialect,
): QueryStringParser<FindOptions> {
  if (dialect === "postgres") {
    ops.data.where = walk<typeof ops.data.where>(
      ops.data.where,
      (key, value) => {
        if (typeof key !== "string") {
          return
        }

        const { operator, innerValue } = parse(value)

        if (!operator) {
          return
        }

        const token = Sequelize.where(
          Sequelize.cast(Sequelize.col(getColumnName(key, dialect)), "varchar"),
          operator,
          innerValue,
        )
        return [[token], Op.and]
      },
    )
  }
  return ops
}
