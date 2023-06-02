import type { ParsedUrlQuery } from "node:querystring"

import querystringParser from "@bitovi/sequelize-querystring-parser"
import type {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Identifier,
  UpdateOptions,
  WhereOptions,
} from "sequelize"

import { codes, statusCodes } from "../error/constants"
import { ValidationError } from "../error/errors"
import type { HatchifyModel, SequelizeModelInstance } from "../types"

interface QSP<T> {
  data: T
  errors: string[]
  orm: "sequelize"
}

export function buildFindOptions(
  model: HatchifyModel,
  querystring: string,
  id?: Identifier,
): QSP<FindOptions> {
  const ops: QSP<FindOptions> = querystringParser.parse(querystring)

  // If we do have an error, fail fast and return it, dont bother checking anything else
  if (ops.errors.length > 0) {
    return ops
  }

  // Perform additional checks if needed...
  if (ops.data?.attributes && Array.isArray(ops.data.attributes)) {
    ops.data.attributes.forEach((attr: string) => {
      if (!model.attributes[attr]) {
        ops.errors.push("Unknown attribute " + attr)
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

export function buildCreateOptions(querystring: string): QSP<CreateOptions> {
  const ops: QSP<CreateOptions> = querystringParser.parse(querystring)

  // If we do have an error, fail fast and return it, don't bother checking anything else
  if (ops.errors.length > 0) {
    return ops
  }

  // Perform additional checks if needed...
  return ops
}

export function buildUpdateOptions(
  querystring: string,
  id?: Identifier,
): QSP<UpdateOptions> {
  const ops: QSP<UpdateOptions> = querystringParser.parse(querystring)

  // If we do have an error, fail fast and return it, dont bother checking anything else
  if (ops.errors.length > 0) {
    return ops
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

export function buildDestroyOptions(
  querystring: string,
  id?: Identifier,
): QSP<DestroyOptions> {
  const ops: QSP<DestroyOptions> = querystringParser.parse(querystring)

  // If we do have an error, fail fast and return it, dont bother checking anything else
  if (ops.errors.length > 0) {
    return ops
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

export function buildAttributeList(
  query: ParsedUrlQuery,
  seqModel: SequelizeModelInstance,
): string[] {
  const queryAttributes = query.attributes

  let attributes: string[] = []
  if (queryAttributes) {
    if (!Array.isArray(queryAttributes)) {
      attributes = [queryAttributes]
    } else {
      attributes = queryAttributes
    }
  }

  // We should always return the pk, which is usually id?
  if (!attributes.includes("id")) {
    attributes.push("id")
  }

  attributes.forEach((attr) => {
    // Make sure that the requested attributes actually exist on the model
    const modelAttributes = seqModel.getAttributes()
    if (!modelAttributes[attr]) {
      throw new ValidationError({
        title: "Bad Attribute:" + attr,
        code: codes.ERR_INVALID_PARAMETER,
        status: statusCodes.UNPROCESSABLE_ENTITY,
        pointer: attr,
      })
    }
  })

  return attributes
}

export function buildWhereClause(
  query: ParsedUrlQuery,
  id?: Identifier,
): WhereOptions {
  if (id) {
    return {
      id: id,
    }
  }

  return {}
}
