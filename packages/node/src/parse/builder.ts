// @ts-ignore TS7016
import querystringParser from "@bitovi/sequelize-querystring-parser"
import type { FinalSchema } from "@hatchifyjs/core"
import { noCase } from "no-case"
import type {
  CreateOptions,
  DestroyOptions,
  Dialect,
  FindOptions,
  Identifier,
  ProjectionAlias,
  UpdateOptions,
} from "sequelize"

import { handleSqliteDateNestedColumns } from "./handleSqliteDateNestedColumns"
import { handleSqliteLike } from "./handleSqliteLike"
import { handleWhere } from "./handleWhere"
import { UnexpectedValueError } from "../error"
import type { Hatchify } from "../node"

export interface QueryStringParser<T, E = UnexpectedValueError> {
  data: T
  errors: E[]
  orm: "sequelize"
}

export interface SequelizeQueryStringParserLib {
  parse: <T>(query: string) => QueryStringParser<T, QueryStringParsingError>
}

export interface QueryStringParsingError extends Error {
  querystring: string
  paramKey: string
  paramValue: any
  name: "QuerystringParsingError"
}

export function buildFindOptions(
  hatchify: Hatchify,
  model: FinalSchema,
  querystring: string,
  id?: Identifier,
): QueryStringParser<FindOptions> {
  const dialect = hatchify.orm.getDialect() as Dialect
  const qspOps: QueryStringParser<FindOptions, QueryStringParsingError> = (
    querystringParser as SequelizeQueryStringParserLib
  ).parse<FindOptions>(querystring)

  if (qspOps.errors.length) {
    throw qspOps.errors.map(
      (error: QueryStringParsingError) =>
        new UnexpectedValueError({
          parameter: error.paramKey,
          detail: error.message,
        }),
    )
  }

  if (!qspOps.data) {
    return qspOps as unknown as QueryStringParser<FindOptions>
  }

  let ops: QueryStringParser<FindOptions> = handleWhere(qspOps, model)

  if (dialect === "sqlite") {
    ops = handleSqliteDateNestedColumns(ops, dialect)
    ops = handleSqliteLike(ops, dialect)
  }

  if (Array.isArray(ops.data.attributes)) {
    if (!ops.data.attributes.includes("id")) {
      ops.data.attributes.unshift("id")
    }

    const modelName = [model.namespace, model.name]
      .filter((x) => x)
      .map((x) => noCase(x as string, { delimiter: "-" }))
      .join("-")

    ops.data.attributes.forEach((attribute: string | ProjectionAlias) => {
      const stringAttribute: string = attribute as unknown as string // no other types come out of the parser
      if (stringAttribute !== "id" && !model.attributes[stringAttribute]) {
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
    for (const orderItem of ops.data.order as string[][]) {
      // any associations to read before the attribute will occur first in the array
      const associations = orderItem.slice(0, -2)
      // the final two items in the array are the attribute name and the direction
      const [attribute /*, direction*/] = orderItem.slice(-2)
      // as we descend across the associations with a for..of, keep track of which
      //   associations we've already validated so e.g. a path of
      //   ["salesperson", "compnay", "name", "asc"]
      //  will fail after "salesperson" because "compnay" is a typo, and the error
      //  message will report "...one or more attributes of salesperson.company"
      const successfulAssociations: string[] = []

      let currentSchema: typeof model = model
      let associationErrorTriggered = false

      // Iterate over every element of the sort that is deemed to be an association name
      for (const associationName of associations) {
        let targetAssociation: string | null = null
        if (
          currentSchema.relationships &&
          Object.keys(currentSchema.relationships).length
        ) {
          targetAssociation =
            currentSchema.relationships[associationName]?.targetSchema
          // Model has relationships but none with the name requested.  Throw an error.
          if (!targetAssociation) {
            ops.errors.push(
              new UnexpectedValueError({
                detail: `URL must have 'sort' as comma separated values containing one or more attributes of ${Object.keys(
                  currentSchema.relationships,
                )
                  .map((association) => `'${association}'`)
                  .join(", ")}.`,
                parameter: "sort",
              }),
            )
            associationErrorTriggered = true
            break
          }
        } else {
          // No relationships on model.  Generate error expecting attributes of last model.
          ops.errors.push(
            new UnexpectedValueError({
              detail: `URL must have 'sort' as comma separated values containing one or more attributes of ${currentSchema.name}.`,
              parameter: "sort",
            }),
          )
          associationErrorTriggered = true
          break
        }
        // descend to next object for association
        successfulAssociations.push(associationName)
        currentSchema = hatchify.schema[targetAssociation]
      }

      if (
        !associationErrorTriggered &&
        attribute !== "id" &&
        !currentSchema.attributes[attribute]
      ) {
        ops.errors.push(
          new UnexpectedValueError({
            detail: `URL must have 'sort' as comma separated values containing one or more of ${Object.keys(
              currentSchema.attributes,
            )
              .map((attribute) => `'${[...associations, attribute].join(".")}'`)
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
  const ops: QueryStringParser<UpdateOptions, QueryStringParsingError> =
    querystringParser.parse(querystring)

  if (ops.errors.length) {
    throw ops.errors.map(
      (error: QueryStringParsingError) =>
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

  return ops as unknown as QueryStringParser<UpdateOptions>
}

export function buildDestroyOptions(
  querystring: string,
  id?: Identifier,
): QueryStringParser<DestroyOptions> {
  const ops: QueryStringParser<DestroyOptions, QueryStringParsingError> =
    querystringParser.parse(querystring)

  if (ops.errors.length) {
    throw ops.errors.map(
      (error: QueryStringParsingError) =>
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
  return ops as unknown as QueryStringParser<DestroyOptions>
}
