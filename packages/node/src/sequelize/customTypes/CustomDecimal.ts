import { HatchifyCoerceError } from "@hatchifyjs/core"
import { DataTypes } from "sequelize"

// @ts-expect-error
export class CustomDecimal extends DataTypes.DECIMAL {
  static parse(value: string): number {
    const parsed = parseFloat(value)

    if ([Infinity, -Infinity].includes(parsed)) {
      throw new HatchifyCoerceError(
        "Retrieved number is outside of the JavaScript number range",
      )
    }

    return parsed
  }
}
