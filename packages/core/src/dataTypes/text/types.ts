import type { PartialDataTypeProps } from "../../types"
import type { PartialStringControlType } from "../string"

export type PartialTextProps = PartialDataTypeProps<string>

export type PartialTextControlType = PartialStringControlType

export interface PartialTextORM {
  sequelize: {
    type: "TEXT"
    allowNull?: boolean
    primaryKey?: boolean
    defaultValue?: string | (() => string) | null
  }
}

export interface FinalTextORM {
  sequelize: Required<PartialTextORM["sequelize"]>
}
