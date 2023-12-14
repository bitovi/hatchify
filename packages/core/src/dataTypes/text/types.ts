import type { PartialDataTypeProps } from "../../types"
import type { PartialStringControlType } from "../string"

export interface PartialTextProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  maxDisplayLength?: number
}

export type PartialTextControlType<TRequired extends boolean> =
  PartialStringControlType<TRequired>

export interface PartialTextORM {
  sequelize: {
    type: "TEXT"
    allowNull?: boolean
    primaryKey?: boolean
    defaultValue?: string | (() => string) | null
    unique?: boolean
    maxDisplayLength?: number | null
  }
}

export interface FinalTextORM {
  sequelize: Required<PartialTextORM["sequelize"]>
}
