import { HatchifyBaseDataType } from "./base"
import type { HatchifyDataTypeControl, HatchifyDataTypeProps } from "./base"
import type { PreparedDataType } from "../types"

export interface HatchifyNumberProps extends HatchifyDataTypeProps {
  autoIncrement?: boolean
  min?: number
  max?: number
  step?: number
}

export interface HatchifyNumberControl extends HatchifyDataTypeControl {
  autoIncrement: boolean
  min: number
  max: number
  step: number
}

export class HatchifyNumber extends HatchifyBaseDataType {
  protected inputProps?: HatchifyNumberProps
  protected controlType: HatchifyNumberControl = {
    allowNull: true,
    autoIncrement: false,
    min: -Infinity,
    max: Infinity,
    primary: false,
    step: 0.1,
  }

  constructor(inputProps?: HatchifyNumberProps) {
    super()
    const {
      autoIncrement = false,
      min = -Infinity,
      max = Infinity,
      primary = false,
      required = false,
      step = 0.1,
    } = inputProps || {}

    this.inputProps = inputProps
    this.controlType.allowNull = !required
    this.controlType.autoIncrement = autoIncrement
    this.controlType.min = min
    this.controlType.max = max
    this.controlType.primary = primary
    this.controlType.step = step
  }

  validateStep(value: number): boolean {
    return (
      Math.round(value / this.controlType.step) /
        (1 / this.controlType.step) ===
      value
    )
  }

  clientMutationCoerce(value: number | null): number | null {
    if (value == null) {
      if (this.controlType.allowNull) return value
      throw new Error("Non-null value is required")
    }

    if (typeof value !== "number") {
      throw new Error("Provided value is not a number")
    }

    if ([-Infinity, Infinity].includes(value)) {
      throw new Error("Infinity as a value is not supported")
    }

    if (value < this.controlType.min) {
      throw new Error(
        `Provided value is lower than the minimum of ${this.controlType.min}`,
      )
    }

    if (value > this.controlType.max) {
      throw new Error(
        `Provided value is higher than the maximum of ${this.controlType.max}`,
      )
    }

    if (!this.validateStep(value)) {
      throw new Error(
        `Provided value violates the step of ${this.controlType.step}`,
      )
    }

    return value
  }

  // Passed  - Any crazy value the client might send as a POST or PATCH
  // Returns - A type the ORM can use
  // Throws  - If the data is bad ❓
  // Example : '2023-07-17T01:45:28.778Z' => new Date('2023-07-17T01:45:28.778Z')
  //         : throw "'4 $core' is not a valid date";
  setORMPropertyValue = (jsonValue: number | null): number | null => {
    return this.clientMutationCoerce(jsonValue)
  }

  // Passed  - Any crazy STRING value the client might send as GET
  // Returns - A type the ORM can use
  // Throws  - If the data is bad ❓
  // Example : ?filter[age]=xyz ... xyz => throw "xyz is not a number";
  setORMQueryFilterValue = (queryValue: string): number | null => {
    if (["null", "undefined"].includes(queryValue)) {
      if (this.controlType.allowNull) return null
      throw new Error("Non-null value is required")
    }

    if (isNaN(queryValue as unknown as number)) {
      throw new Error("Provided value is not a number")
    }

    return this.clientMutationCoerce(+queryValue)
  }

  // ===== RESPONSE =====
  // Passed  - A value from the ORM
  // Returns - A JSON value that can be serialized
  // Example : new Date() => '2023-07-17T01:45:28.778Z'
  serializeORMPropertyValue = (ormValue: number | null): number | null => {
    return this.clientMutationCoerce(ormValue)
  }

  public prepare(): PreparedDataType<number> {
    return {
      name: `number(${this.inputProps ? JSON.stringify(this.inputProps) : ""})`,
      orm: {
        sequelize: {
          type: "DOUBLE",
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

export function number(props?: HatchifyNumberProps): HatchifyNumber {
  return new HatchifyNumber(props)
}
