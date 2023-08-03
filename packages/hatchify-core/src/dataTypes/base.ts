import type { PreparedDataType } from "../types"

export interface HatchifyDataTypeProps {
  primary?: boolean
  required?: boolean
}

export interface HatchifyDataTypeControl {
  allowNull?: boolean
  primary?: boolean
}

export abstract class HatchifyBaseDataType {
  protected inputProps?: HatchifyDataTypeProps
  protected controlType: HatchifyDataTypeControl = {}

  constructor(inputProps?: HatchifyDataTypeProps) {
    const { required = false, primary = false } = inputProps || {}

    this.inputProps = inputProps
    this.controlType.allowNull = !required
    this.controlType.primary = primary
  }

  abstract prepare(): PreparedDataType<number>

  public primary(): HatchifyBaseDataType {
    // this.inputProps = Object.assign({}, this, this.inputProps || {}, {
    //   primary: true,
    // })
    this.controlType.primary = true
    return this
  }

  public getControlType(): HatchifyDataTypeControl {
    return Object.entries(this.controlType).reduce(
      (acc, [key, value]) => ({ ...acc, [key]: value }),
      {},
    )
  }
}
