import type QuerystringParsingError from "@bitovi/querystring-parser/lib/errors/querystring-parsing-error"
import querystringParser from "@bitovi/sequelize-querystring-parser"
import { noCase } from "no-case"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
} from "sequelize"
import { Op, Sequelize } from "sequelize"

import { UnexpectedValueError } from "../error"
import type { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

interface QueryStringParser<T> {
  data: T
  errors: Error[]
  orm: "sequelize"
}

function handleSqliteLike(
  ops: QueryStringParser<FindOptions>,
  dbType: string,
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

  if (dbType === "sqlite") {
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

export function buildFindOptions(
  hatchify: Hatchify,
  model: HatchifyModel,
  querystring: string,
  id?: Identifier,
): QueryStringParser<FindOptions> {
  const ops: QueryStringParser<FindOptions> = handleSqliteLike(
    querystringParser.parse(querystring),
    hatchify.orm.getDialect(),
  )

  if (ops.errors.length) {
    throw ops.errors.map(
      (error: QuerystringParsingError) =>
        new UnexpectedValueError({
          parameter: error.paramKey,
          detail: error.message,
        }),
    )
  }

  if (!ops.data) {
    return ops
  }

  Object.keys(ops.data.where || {}).forEach((attribute) => {
    if (attribute !== "id" && !model.attributes[attribute]) {
      ops.errors.push(
        new UnexpectedValueError({
          detail: `URL must have 'filter[x]' where 'x' is one of ${Object.keys(
            model.attributes,
          )
            .map((attribute) => `'${attribute}'`)
            .join(", ")}.`,
          parameter: `filter[${attribute}]`,
        }),
      )
    }
  })

  if (Array.isArray(ops.data.attributes)) {
    if (!ops.data.attributes.includes("id")) {
      ops.data.attributes.unshift("id")
    }

    const modelName = noCase(model.name, { delimiter: "-" })

    ops.data.attributes.forEach((attribute: string) => {
      if (attribute !== "id" && !model.attributes[attribute]) {
        ops.errors.push(
          new UnexpectedValueError({
            detail: `URL must have 'fields[${modelName}]' as comma separated values containing one or more of ${Object.keys(
              model.attributes,
            )
              .map((attribute) => `'${attribute}'`)
              .join(", ")}.`,
            parameter: `fields[${modelName}]`,
          }),
        )
      }
    })
  }

  if (Array.isArray(ops.data.order)) {
    for (const orderItem of ops.data.order) {
      const attribute = orderItem[0]

      if (attribute !== "id" && !model.attributes[attribute]) {
        ops.errors.push(
          new UnexpectedValueError({
            detail: `URL must have 'sort' as comma separated values containing one or more of ${Object.keys(
              model.attributes,
            )
              .map((attribute) => `'${attribute}'`)
              .join(", ")}.`,
            parameter: "sort",
          }),
        )
      }
    }
  }

  if (ops.errors.length) {
    throw ops.errors
  }

  if (!ops.data.where) {
    ops.data.where = {}
    if (id) {
      ops.data.where.id = id
    }
  }

  return ops
}

export function buildCreateOptions(
  querystring: string,
): QueryStringParser<CreateOptions> {
  return querystringParser.parse(querystring)
}

export function buildUpdateOptions(
  querystring: string,
  id?: Identifier,
): QueryStringParser<UpdateOptions> {
  const ops: QueryStringParser<UpdateOptions> =
    querystringParser.parse(querystring)

  if (ops.errors.length) {
    throw ops.errors.map(
      (error: QuerystringParsingError) =>
        new UnexpectedValueError({
          parameter: error.paramKey,
          detail: error.message,
        }),
    )
  }

  if (!ops.data.where) {
    ops.data.where = {}
    if (id) {
      ops.data.where.id = id
    }
  }

  return ops
}

export function buildDestroyOptions(
  querystring: string,
  id?: Identifier,
): QueryStringParser<DestroyOptions> {
  const ops: QueryStringParser<DestroyOptions> =
    querystringParser.parse(querystring)

  if (ops.errors.length) {
    throw ops.errors.map(
      (error: QuerystringParsingError) =>
        new UnexpectedValueError({
          parameter: error.paramKey,
          detail: error.message,
        }),
    )
  }

  if (!ops.data.where) {
    ops.data.where = {}
    if (id) {
      ops.data.where.id = id
    }
  }

  // Perform additional checks if needed...
  return ops
}
