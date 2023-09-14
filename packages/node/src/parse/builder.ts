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

import { handleSqliteLike } from "./handleSqliteLike"
import { handleWhere } from "./handleWhere"
import { UnexpectedValueError } from "../error"
import type { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

export interface QueryStringParser<T> {
  data: T
  errors: Error[]
  orm: "sequelize"
}

export function buildFindOptions(
  hatchify: Hatchify,
  model: HatchifyModel,
  querystring: string,
  id?: Identifier,
): QueryStringParser<FindOptions> {
  let ops: QueryStringParser<FindOptions> = querystringParser.parse(querystring)

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

  ops = handleWhere(ops, model)
  ops = handleSqliteLike(ops, hatchify.orm.getDialect())

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
