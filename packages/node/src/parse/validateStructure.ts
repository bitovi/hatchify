import { capitalize, singularize } from "inflection"

import { UnexpectedValueError, ValueRequiredError } from "../error"
import type { HatchifyError } from "../error"
import type { HatchifyModel } from "../types"

function isObject(value: any): boolean {
  return value && typeof value === "object" && !Array.isArray(value)
}

export function validateStructure<T extends HatchifyModel = HatchifyModel>(
  body: any,
  model: T,
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
        detail: `Payload must have 'data' as an object.`,
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

  if (typeof body.data.type !== model.name) {
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
        detail: `Payload must have 'attributes' as an object.`,
        pointer: "/data/attributes",
      }),
    ]
  }

  const relationshipsErrors = Object.entries(
    body.data.relationships || {},
  ).reduce((acc, [relationshipName, relationshipValue]: [string, any]) => {
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
          detail: `Payload must include a value for 'data'.`,
          pointer: `/data/attributes/${relationshipName}/data`,
        }),
      ]
    }

    const relationshipErrors: HatchifyError[] = []

    const modelName = capitalize(singularize(relationshipName))

    const expectObject =
      model.hasOne?.some(({ target }) => target === modelName) ||
      model.belongsTo?.some(({ target }) => target === modelName)
    const expectArray =
      model.hasMany?.some(({ target }) => target === modelName) ||
      model.belongsToMany?.some(({ target }) => target === modelName)

    if (expectArray && !Array.isArray(relationshipValue.data)) {
      relationshipErrors.push(
        new UnexpectedValueError({
          detail: `Payload must have 'data' as an array.`,
          pointer: `/data/relationships/${relationshipName}/data`,
        }),
      )
    }

    if (expectObject && !isObject(relationshipValue.data)) {
      relationshipErrors.push(
        new UnexpectedValueError({
          detail: `Payload must have 'data' as an object.`,
          pointer: `/data/relationships/${relationshipName}/data`,
        }),
      )
    }

    return [...acc, ...relationshipErrors]
  }, [])

  if (relationshipsErrors.length) throw relationshipsErrors
}
