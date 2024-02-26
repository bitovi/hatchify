import { getSchemaKey } from "@hatchifyjs/core"
import type { FinalSchema } from "@hatchifyjs/core"
import type { FindOptions } from "sequelize"

import type { QueryStringParser, QueryStringParsingError } from "./builder.js"
import { getColumnName } from "./getColumnName.js"
import { isPathIncluded } from "./isPathIncluded.js"
import { isValidAttribute } from "./isValidAttribute.js"
import { walk } from "./walk.js"
import { RelationshipPathError, UnexpectedValueError } from "../error/index.js"
import type { ModelFunctionsCollection } from "../types.js"

export function handleWhere(
  ops: QueryStringParser<FindOptions, QueryStringParsingError>,
  schema: FinalSchema,
  allSchemas: ModelFunctionsCollection<FinalSchema>,
  flatIncludes: string[],
): QueryStringParser<FindOptions, UnexpectedValueError> {
  const errors: UnexpectedValueError[] = []

  const where = walk(ops.data.where, (key) => {
    if (typeof key !== "string") {
      return [null, key]
    }

    if (!key.includes(".")) {
      if (key !== "id" && !schema.attributes[key]) {
        errors.push(
          new UnexpectedValueError({
            detail: `URL must have 'filter[x]' where 'x' is one of ${Object.keys(
              schema.attributes,
            )
              .map((attribute) => `'${attribute}'`)
              .join(", ")}.`,
            parameter: `filter[${key}]`,
          }),
        )
      }

      return [null, `$${getColumnName(`${getSchemaKey(schema)}.${key}`)}$`]
    }

    const relationshipPath = key.split(".")

    if (!isPathIncluded(flatIncludes, relationshipPath)) {
      errors.push(
        new RelationshipPathError({
          detail: `URL must have 'include' with '${key
            .split(".")
            .slice(0, relationshipPath.length - 1)
            .join(".")}' as one of the relationships to include.`,
          parameter: "include",
        }),
      )
    }

    if (!isValidAttribute(getSchemaKey(schema), relationshipPath, allSchemas)) {
      errors.push(
        new RelationshipPathError({
          detail: `URL must have 'filter[${key}]' where '${key}' is a valid attribute.`,
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
