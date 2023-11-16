import { FinalSchema, getSchemaKey } from "@hatchifyjs/core"
import type { FindOptions } from "sequelize"

import {
  RelationshipPathError,
  UnexpectedValueError,
  ValueRequiredError,
} from "../error"
import type { HatchifyError } from "../error/types"
import type { Hatchify } from "../node"

function isObject(value: any): boolean {
  return value && typeof value === "object" && !Array.isArray(value)
}

export function validateFindOptions<T extends FinalSchema = FinalSchema>(
  options: FindOptions,
  schema: T,
  hatchify: Hatchify,
): void {
  if (options.include) {
    const include = Array.isArray(options.include)
      ? options.include
      : [options.include]

    const associations = hatchify.associationsLookup[getSchemaKey(schema)] || {}
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

export function validateStructure<T extends FinalSchema = FinalSchema>(
  body: any,
  schema: T,
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

  if (body.data.type !== getSchemaKey(schema)) {
    throw [
      new UnexpectedValueError({
        detail: `Payload must have 'type' as '${getSchemaKey(schema)}'.`,
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

  const relationshipsErrors = Object.entries(body.data.relationships).reduce<
    Error[]
  >((acc, [relationshipName, relationshipValue]: [string, any]) => {
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

    const associations = hatchify.associationsLookup[getSchemaKey(schema)]

    let modelAssociation
    if (associations) {
      modelAssociation = associations[relationshipName]
    }

    if (!modelAssociation) {
      relationshipErrors.push(
        new RelationshipPathError({
          detail: `Payload must include an identifiable relationship path.`,
          pointer: `/data/relationships/${relationshipName}`,
        }),
      )
    } else {
      const modelName = modelAssociation.model
      const targetRelationship = Object.values(schema.relationships || {}).find(
        ({ targetSchema }) => targetSchema === modelName,
      )
      const expectObject =
        targetRelationship &&
        ["hasOne", "belongsTo"].includes(targetRelationship.type)
      const expectArray =
        targetRelationship &&
        ["hasMany", "belongsToMany"].includes(targetRelationship.type)

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
    }

    return [...acc, ...relationshipErrors]
  }, [])

  if (relationshipsErrors.length) {
    throw relationshipsErrors
  }
}
