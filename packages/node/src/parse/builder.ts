import type QuerystringParsingError from "@bitovi/querystring-parser/lib/errors/querystring-parsing-error"
import querystringParser from "@bitovi/sequelize-querystring-parser"
import { noCase } from "no-case"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
  WhereOptions,
} from "sequelize"

import { HatchifyError, UnexpectedValueError } from "../error"
import { codes, statusCodes } from "../error/constants"
import type { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

interface QueryStringParser<T> {
  data: T
  errors: Error[]
  orm: "sequelize"
}

function handleSqliteLike(querystring: string, dbType: string): string {
  // if not postgres (sqlite)
  // 1. throw error if like is used (temporary)
  // 2. ilike needs to be changed to like before parsing query
  // 3. TODO - HATCH-329 if query includes an array, it needs to be changed to an OR query
  // (sqlite doesn't support Op.any like postgres)
  if (dbType === "sqlite") {
    if (querystring.includes("[$like]")) {
      throw new HatchifyError({
        code: codes.ERR_INVALID_PARAMETER,
        title: "SQLITE does not support like",
        status: statusCodes.UNPROCESSABLE_ENTITY,
        detail: "SQLITE does not support like. Please use ilike",
        parameter: querystring,
      })
    }

    return querystring.replaceAll("[$ilike]", "[$like]")
  }

  return querystring
}

function renameRelationshipFilters(
  model: HatchifyModel,
  where: WhereOptions<any> | undefined,
) {
  const errors: Error[] = []

  function _renameRelationshipFilters(where) {
    if (typeof where !== "object") {
      return where
    }

    if (Array.isArray(where)) {
      return where.map(_renameRelationshipFilters)
    }

    return [
      ...Object.getOwnPropertyNames(where),
      ...Object.getOwnPropertySymbols(where),
    ].reduce((acc, key) => {
      if (typeof key === "symbol") {
        return { ...acc, [key]: _renameRelationshipFilters(where[key]) }
      }

      if (!key.includes(".")) {
        if (key !== "id" && !model.attributes[key]) {
          errors.push(
            new UnexpectedValueError({
              detail: `URL must have 'filter[x]' where 'x' is one of ${Object.keys(
                model.attributes,
              )
                .map((attribute) => `'${attribute}'`)
                .join(", ")}.`,
              parameter: `filter[${key}]`,
            }),
          )
        }

        return {
          ...acc,
          [key]: _renameRelationshipFilters(where[key]),
        }
      }

      return {
        ...acc,
        [`$${key}$`]: _renameRelationshipFilters(where[key]),
      }
    }, {})
  }

  return { where: _renameRelationshipFilters(where), errors }
}

export function buildFindOptions(
  hatchify: Hatchify,
  model: HatchifyModel,
  querystring: string,
  id?: Identifier,
): QueryStringParser<FindOptions> {
  const ops: QueryStringParser<FindOptions> = querystringParser.parse(
    handleSqliteLike(querystring, hatchify.orm.getDialect()),
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

  const { where, errors } = renameRelationshipFilters(model, ops.data.where)
  ops.data.where = where
  ops.errors.push(...errors)

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
