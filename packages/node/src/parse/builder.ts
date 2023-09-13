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
import { UnexpectedValueError } from "../error"
import type { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

export interface QueryStringParser<T> {
  data: T
  errors: Error[]
  orm: "sequelize"
}

interface Include {
  association: string
}

function renameRelationshipFilters(
  model: HatchifyModel,
  ops: QueryStringParser<FindOptions>,
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

      const [relationshipName] = key.split(".")

      const relationshipNames = (
        !ops.data.include || Array.isArray(ops.data.include)
          ? ((ops.data.include ?? []) as Include[])
          : [ops.data.include as Include]
      ).map((include) => include.association)

      if (!relationshipNames.includes(relationshipName)) {
        errors.push(
          new UnexpectedValueError({
            detail: `URL must have 'filter[${key}]' where '${relationshipName}' is one of the includes.`,
            parameter: `filter[${key}]`,
          }),
        )
      }

      return {
        ...acc,
        [`$${key}$`]: _renameRelationshipFilters(where[key]),
      }
    }, {})
  }

  return { where: _renameRelationshipFilters(ops.data.where), errors }
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

  const { where, errors } = renameRelationshipFilters(model, ops)
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
