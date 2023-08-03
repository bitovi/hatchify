import { HatchifyNumber } from "./number"
import type { HatchifyNumberControl, HatchifyNumberProps } from "./number"
import type { PreparedDataType } from "../types"

export type HatchifyIntegerProps = Omit<HatchifyNumberProps, "step">

export class HatchifyInteger extends HatchifyNumber {
  protected inputProps?: HatchifyIntegerProps
  protected controlType: HatchifyNumberControl = {
    allowNull: true,
    autoIncrement: false,
    min: -Infinity,
    max: Infinity,
    primary: false,
    step: 1,
  }

  constructor(inputProps?: HatchifyIntegerProps) {
    super()
    const {
      autoIncrement = false,
      min = -Infinity,
      max = Infinity,
      primary = false,
      required = false,
    } = inputProps || {}

    this.inputProps = inputProps

    this.controlType.allowNull = !required
    this.controlType.autoIncrement = autoIncrement
    this.controlType.min = min
    this.controlType.max = max
    this.controlType.primary = primary
  }

  public prepare(): PreparedDataType<number> {
    return {
      name: `integer(${
        this.inputProps ? JSON.stringify(this.inputProps) : ""
      })`,
      orm: {
        sequelize: {
          type: "INTEGER",
          typeArgs: [],
          allowNull: this.controlType.allowNull,
          autoIncrement: this.controlType.autoIncrement,
          primaryKey: this.controlType.primary,
          validate: {
            min: this.controlType.min,
            max: this.controlType.max,
          },
        },
      },
      controlType: {
        type: "Number",
        allowNull: this.controlType.allowNull,
        min: this.controlType.min,
        max: this.controlType.max,
        primary: this.controlType.primary,
        step: this.controlType.step,
      },
      setORMPropertyValue: this.setORMPropertyValue,
      setORMQueryFilterValue: this.setORMQueryFilterValue,
      serializeORMPropertyValue: this.serializeORMPropertyValue,
    }
  }
}

export function integer(props?: HatchifyIntegerProps): HatchifyInteger {
  return new HatchifyInteger(props)
}
