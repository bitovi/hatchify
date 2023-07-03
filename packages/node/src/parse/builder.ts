import querystringParser from "@bitovi/sequelize-querystring-parser"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
} from "sequelize"

import type { HatchifyModel } from "../types"

interface QueryStringParser<T> {
  data: T
  errors: Error[]
  orm: "sequelize"
}

export function buildFindOptions(
  model: HatchifyModel,
  querystring: string,
  id?: Identifier,
): QueryStringParser<FindOptions> {
  const ops: QueryStringParser<FindOptions> =
    querystringParser.parse(querystring)

  // If we do have an error, fail fast and return it, don't bother checking anything else
  if (ops.errors.length > 0) return ops

  if (ops.data?.attributes && Array.isArray(ops.data.attributes)) {
    if (!ops.data.attributes.includes("id")) {
      ops.data.attributes.unshift("id")
    }

    ops.data.attributes.forEach((attr: string) => {
      if (attr !== "id" && !model.attributes[attr]) {
        ops.errors.push(new Error("Unknown attribute " + attr))
      }
    })
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

  // If we do have an error, fail fast and return it, don't bother checking anything else
  if (ops.errors.length > 0) return ops

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

  // If we do have an error, fail fast and return it, don't bother checking anything else
  if (ops.errors.length > 0) return ops

  if (!ops.data.where) {
    ops.data.where = {}
    if (id) {
      ops.data.where.id = id
    }
  }

  // Perform additional checks if needed...
  return ops
}
