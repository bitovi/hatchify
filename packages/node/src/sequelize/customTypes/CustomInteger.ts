import { HatchifyCoerceError } from "@hatchifyjs/core"
import { DataTypes } from "sequelize"

// @ts-expect-error
export class CustomInteger extends DataTypes.INTEGER {
  static parse(value: string): number {
    const parsed = parseInt(value)

    if (parsed < Number.MIN_SAFE_INTEGER || parsed > Number.MAX_SAFE_INTEGER) {
      throw new HatchifyCoerceError(
        "Retrieved number is outside of the JavaScript safe integer range",
      )
    }

    return parsed
  }
}
