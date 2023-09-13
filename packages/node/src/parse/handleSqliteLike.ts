import type { FindOptions } from "sequelize"
import { Op, Sequelize } from "sequelize"

import type { QueryStringParser } from "./builder"

export function handleSqliteLike(
  ops: QueryStringParser<FindOptions>,
  dialect: string,
): QueryStringParser<FindOptions> {
  // if not postgres (sqlite)
  // 1. throw error if like is used (temporary)
  // 2. ilike needs to be changed to like before parsing query
  // 3. TODO - HATCH-329 if query includes an array, it needs to be changed to an OR query
  // (sqlite doesn't support Op.any like postgres)
  //
  ///if (key === Op.like)
  ///
  const walk: <T>(
    maybeObj: T | any[],
    fn: (key: string | symbol, value: unknown) => void,
  ) => T | any[] = (maybeObj, fn) => {
    if (Array.isArray(maybeObj)) {
      return maybeObj.map((item) => walk<typeof item>(item, fn))
    } else if (maybeObj && typeof maybeObj === "object") {
      const keys = [
        ...Object.getOwnPropertyNames(maybeObj),
        ...Object.getOwnPropertySymbols(maybeObj),
      ]
      const entries = keys.map((k) => [k, maybeObj[k]])
      return entries.reduce((acc, [key, value]) => {
        const [newVal, newKey = key] =
          (fn(key, value) as unknown as [unknown, string | symbol]) ?? []
        return {
          ...acc,
          [newKey]: newVal ?? walk<typeof value>(value, fn),
        }
      }, {}) as typeof maybeObj
    } else {
      return maybeObj
    }
  }

  // const reEscape = (str) =>
  //   `^${str.replace(/([[\]()^$*+{}.])/g, "\\$1").replace(/%/g, ".*")}$`
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
            // Was previously trying to implement these clauses as regex instead,
            // but the regex plugin is unstable (at least on Darwin x64) and
            // wouldn't complete the tests without segfaulting.
            // return [
            //   (value[Op.any] as string[]).map(reEscape).join("|"),
            //   Op.regexp,
            // ]
          } else {
            // If not LIKE ANY, i.e. just LIKE, no transform is necessary
            return [value, key]
            // return [reEscape(value as string), Op.regexp]
          }
        }
        // SQLite does not have an ILIKE operator.  At DB connection time
        // we set a PRAGMA to make LIKE case sensitive (it is case insensitive
        // by default) so LIKE is normal but ILIKE must be implemented as
        //   LIKE UPPER(col) = value.toUpperCase()
        // The implementation comes from a special Sequelize consructor to
        // create a WHERE clause or sub-clause with a function call on a column
        // (first arg), an operator (second arg), and a simple string expression
        // (third arg).
        if (typeof key === "string" && Op.iLike in (value as any)) {
          const ilClause = (value as { [Op.iLike]: any })[Op.iLike]
          if (ilClause && typeof ilClause === "object" && Op.any in ilClause) {
            // S
            return [
              // could also do a regex if the regex extension worked,
              //   like above regex example but prefix regex with (?i)
              (ilClause[Op.any] as string[]).map((token) =>
                Sequelize.where(
                  Sequelize.fn("upper", Sequelize.col(key)),
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
              Sequelize.fn("upper", Sequelize.col(key)),
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
