import type { Dialect, FindOptions } from "sequelize"
import { Op, Sequelize } from "sequelize"

import type { QueryStringParser } from "./builder.js"
import { getColumnName } from "./getColumnName.js"
import { walk } from "./walk.js"

export function handleSqliteLike(
  ops: QueryStringParser<FindOptions>,
  dialect: Dialect,
): QueryStringParser<FindOptions> {
  if (dialect === "sqlite") {
    ops.data.where = walk<typeof ops.data.where>(
      ops.data.where,
      (key, value) => {
        if (key === Op.like) {
          // PostgreSQL has a LIKE ANY clause but SQLite does not understand
          // the ANY part.  For LIKE ANY, convert to an OR of LIKEs.
          if (value && typeof value === "object" && Op.any in value) {
            return [
              (value[Op.any] as string[]).map((token) => ({
                [Op.like]: token,
              })),
              Op.or,
            ]
          } else {
            // If not LIKE ANY, i.e. just LIKE, no transform is necessary
            return [value, key]
          }
        }
        // SQLite does not have an ILIKE operator.  At DB connection time
        // we set a PRAGMA to make LIKE case sensitive (it is case insensitive
        // by default) so LIKE is normal but ILIKE must be implemented as
        //   LIKE UPPER(col) = value.toUpperCase()
        // The implementation comes from a special Sequelize constructor to
        // create a WHERE clause or sub-clause with a function call on a column
        // (first arg), an operator (second arg), and a simple string expression
        // (third arg).
        if (typeof key === "string" && Op.iLike in (value as any)) {
          const ilClause = (value as { [Op.iLike]: any })[Op.iLike]
          if (ilClause && typeof ilClause === "object" && Op.any in ilClause) {
            return [
              (ilClause[Op.any] as string[]).map((token) =>
                Sequelize.where(
                  Sequelize.fn(
                    "upper",
                    Sequelize.col(getColumnName(key, dialect)),
                  ),
                  Op.like,
                  (token as string).toUpperCase(),
                ),
              ),
              Op.or,
            ]
          } else {
            // Because of how we're walking the original object it's hard
            // to replace a keyed object property with a WHERE.  For
            // convenience, an ILIKE on SQLite is structured as
            //    { [Op.and]: [<where clause with upper()>] }
            // because Op.and is expected to be an array but if the array is
            // length 1 then the actual SQL can discard using any ANDs
            const token = Sequelize.where(
              Sequelize.fn("upper", Sequelize.col(getColumnName(key, dialect))),
              Op.like,
              (ilClause as string).toUpperCase(),
            )
            return [[token], Op.and]
          }
        }
        return
      },
    )
  }
  return ops
}
