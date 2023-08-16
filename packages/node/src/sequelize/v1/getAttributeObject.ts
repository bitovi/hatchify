import { DataTypes } from "sequelize"
import type { DataType, Model } from "sequelize"

import type { Attribute } from "./types"

export function getAttributeAsObject<M extends Model = Model>(
  attribute: string | DataType | Attribute<M>,
): Attribute<M> {
  if (typeof attribute === "string") {
    return { type: DataTypes[attribute] }
  }

  if (typeof attribute === "function") {
    return { type: attribute }
  }

  if ("type" in attribute) {
    if (typeof attribute.type === "string") {
      return { ...attribute, type: DataTypes[attribute.type] }
    }

    return attribute
  }

  throw new Error("Unexpected type")
}
