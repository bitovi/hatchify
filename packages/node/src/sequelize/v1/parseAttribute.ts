import type { DataType, Model } from "sequelize"

import { getAttributeAsObject } from "./getAttributeObject"
import type { Attribute } from "./types"

export function parseAttribute<M extends Model = Model>(
  attribute: string | DataType | Attribute<M>,
): Attribute<M> {
  const attributeObjectType = getAttributeAsObject(attribute)

  if (attributeObjectType.type.toString({}) === "ENUM") {
    return {
      ...attributeObjectType,
      validate: {
        ...(attributeObjectType.validate || {}),
        isIn: [attributeObjectType.values as string[]],
      },
    }
  }

  return attributeObjectType
}
