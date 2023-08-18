import * as dotenv from "dotenv"
import type { FindOptions } from "sequelize"

import {
  RelationshipPathError,
  UnexpectedValueError,
  ValueRequiredError,
} from "../error"
import { codes, statusCodes } from "../error/constants"
import { HatchifyError } from "../error/types"
import type { Hatchify } from "../node"
import type { HatchifyModel } from "../types"

dotenv.config({
  path: ".env",
})

function isObject(value: any): boolean {
  return value && typeof value === "object" && !Array.isArray(value)
}

export function validateFindOptions<T extends HatchifyModel = HatchifyModel>(
  options: FindOptions,
  model: T,
  hatchify: Hatchify,
): void {
  if (options.where && process.env.DB_CONFIG !== "postgres") {
    for (const key in options.where) {
      const paramObj = options.where[key]
      const iLikeParams = Object.getOwnPropertySymbols(paramObj)
        .filter((s) => {
          if (s.toString() === "Symbol(iLike)") {
            return true
          }
          return false
        })
        .map((res) => paramObj[res])
      const parameters = iLikeParams.map((p) => `[$iLike]=${p}`)
      const parameter = parameters.join(",")
      if (iLikeParams.length) {
        throw new HatchifyError({
          code: codes.ERR_INVALID_PARAMETER,
          title: "SQLITE does not support ilike",
          status: statusCodes.UNPROCESSABLE_ENTITY,
          detail: "SQLITE does not support ilike. Please use like",
          parameter,
        })
      }
    }
  }
  if (options.include) {
    const include = Array.isArray(options.include)
      ? options.include
      : [options.include]

    const associations = hatchify.associationsLookup[model.name] || {}
    const includeErrors: Error[] = []

    if (include.length && !Object.keys(associations).length) {
      throw [
        new RelationshipPathError({
          detail: "URL must not have 'include' as a parameter.",
          parameter: `include`,
        }),
      ]
    }

    include.forEach((incl: unknown) => {
      const includeName = (incl as { association: string }).association

      let modelAssociation
      if (associations) {
        modelAssociation = associations[includeName]
      }

      if (!(modelAssociation && modelAssociation.model in hatchify.models)) {
        includeErrors.push(
          new RelationshipPathError({
            detail: `URL must have 'include' as one or more of ${Object.keys(
              associations,
            )
              .map((assoc) => `'${assoc}'`)
              .join(", ")}.`,
            parameter: `include`,
          }),
        )
      }
    })

    if (includeErrors.length) {
      throw includeErrors
    }
  }
}

export function validateStructure<T extends HatchifyModel = HatchifyModel>(
  body: any,
  model: T,
  hatchify: Hatchify,
): void {
  const title = "Payload is missing a required value."

  if (body.data === undefined) {
    throw [
      new ValueRequiredError({
        title,
        detail: "Payload must include a value for 'data'.",
        pointer: "/data",
      }),
    ]
  }

  if (!isObject(body.data)) {
    throw [
      new UnexpectedValueError({
        detail: "Payload must have 'data' as an object.",
        pointer: "/data",
      }),
    ]
  }

  if (body.data.type === undefined) {
    throw [
      new ValueRequiredError({
        title,
        detail: "Payload must include a value for 'type'.",
        pointer: "/data/type",
      }),
    ]
  }

  if (body.data.type !== model.name) {
    throw [
      new UnexpectedValueError({
        detail: `Payload must have 'type' as '${model.name}'.`,
        pointer: "/data/type",
      }),
    ]
  }

  if (body.data.attributes === undefined) {
    throw [
      new ValueRequiredError({
        title,
        detail: "Payload must include a value for 'attributes'.",
        pointer: "/data/attributes",
      }),
    ]
  }

  if (!isObject(body.data.attributes)) {
    throw [
      new UnexpectedValueError({
        detail: "Payload must have 'attributes' as an object.",
        pointer: "/data/attributes",
      }),
    ]
  }

  if (!body.data.relationships) {
    return
  }

  if (!isObject(body.data.relationships)) {
    throw [
      new UnexpectedValueError({
        detail: "Payload must have 'relationships' as an object.",
        pointer: "/data/relationships",
      }),
    ]
  }

  const relationshipsErrors = Object.entries(body.data.relationships).reduce(
    (acc, [relationshipName, relationshipValue]: [string, any]) => {
      if (!relationshipValue) {
        return [
          ...acc,
          new ValueRequiredError({
            title,
            detail: `Payload must include a value for '${relationshipName}'.`,
            pointer: `/data/attributes/${relationshipName}`,
          }),
        ]
      }

      if (relationshipValue.data === undefined) {
        return [
          ...acc,
          new ValueRequiredError({
            title,
            detail: "Payload must include a value for 'data'.",
            pointer: `/data/attributes/${relationshipName}/data`,
          }),
        ]
      }

      const relationshipErrors: HatchifyError[] = []

      const associations = hatchify.associationsLookup[model.name]

      let modelAssociation
      if (associations) {
        modelAssociation = associations[relationshipName]
      }

      if (modelAssociation) {
        const modelName = modelAssociation.model
        const expectObject =
          model.hasOne?.some(({ target }) => target === modelName) ||
          model.belongsTo?.some(({ target }) => target === modelName)
        const expectArray =
          model.hasMany?.some(({ target }) => target === modelName) ||
          model.belongsToMany?.some(({ target }) => target === modelName)

        if (expectArray && !Array.isArray(relationshipValue.data)) {
          relationshipErrors.push(
            new UnexpectedValueError({
              detail: "Payload must have 'data' as an array.",
              pointer: `/data/relationships/${relationshipName}/data`,
            }),
          )
        }

        if (expectObject && !isObject(relationshipValue.data)) {
          relationshipErrors.push(
            new UnexpectedValueError({
              detail: "Payload must have 'data' as an object.",
              pointer: `/data/relationships/${relationshipName}/data`,
            }),
          )
        }
      } else {
        relationshipErrors.push(
          new RelationshipPathError({
            detail: "Payload must include an identifiable relationship path.",
            pointer: `/data/relationships/${relationshipName}`,
          }),
        )
      }

      return [...acc, ...relationshipErrors]
    },
    [],
  )

  if (relationshipsErrors.length) {
    throw relationshipsErrors
  }
}
