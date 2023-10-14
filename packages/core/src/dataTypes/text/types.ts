import type { PartialDataTypeProps } from "../../types"
import type { PartialStringControlType } from "../string"

export type PartialTextProps<TRequired extends boolean> = PartialDataTypeProps<
  string,
  TRequired
>

export type PartialTextControlType<TRequired extends boolean> =
  PartialStringControlType<TRequired>

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
