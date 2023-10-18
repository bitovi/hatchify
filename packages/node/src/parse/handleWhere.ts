import type { FinalSchema } from "@hatchifyjs/core"
import type { FindOptions } from "sequelize"

import type { QueryStringParser, QueryStringParsingError } from "./builder"
import { getColumnName } from "./getColumnName"
import { walk } from "./walk"
import { UnexpectedValueError } from "../error"
import { getFullModelName } from "../utils/getFullModelName"

interface Include {
  association: string
}

export function handleWhere(
  ops: QueryStringParser<FindOptions, QueryStringParsingError>,
  model: FinalSchema,
): QueryStringParser<FindOptions, UnexpectedValueError> {
  const errors: UnexpectedValueError[] = []

  const where = walk(ops.data.where, (key, value) => {
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

      return [null, `$${getColumnName(`${getFullModelName(model)}.${key}`)}$`]
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
    errors: [...(ops.errors as unknown as UnexpectedValueError[]), ...errors],
  }
}
