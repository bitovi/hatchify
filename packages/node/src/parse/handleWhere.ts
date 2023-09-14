import type { FindOptions } from "sequelize"

import type { QueryStringParser } from "./builder"
import { getColumnName } from "./getColumnName"
import { walk } from "./walk"
import { UnexpectedValueError } from "../error"
import type { HatchifyModel } from "../types"

interface Include {
  association: string
}

export function handleWhere(
  ops: QueryStringParser<FindOptions>,
  model: HatchifyModel,
): QueryStringParser<FindOptions> {
  const errors: Error[] = []

  const where = walk<typeof ops.data.where>(ops.data.where, (key) => {
    if (typeof key !== "string") {
      return [null, key]
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

      return [null, key]
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

    return [null, `$${getColumnName(key)}$`]
  })

  return {
    ...ops,
    data: {
      ...ops.data,
      where,
    },
    errors: [...ops.errors, ...errors],
  }
}
