import type { PartialDataTypeProps } from "../../types"
import type { PartialStringControlType } from "../string"

export type PartialTextProps = PartialDataTypeProps

export type PartialTextControlType = PartialStringControlType

export interface PartialTextORM {
  sequelize: {
    type: "TEXT"
    allowNull?: boolean
    primaryKey?: boolean
  }
}

export interface FinalTextORM {
  sequelize: Required<PartialTextORM["sequelize"]>
}
