import type { PartialDataTypeProps } from "../../types/index.js"
import type { PartialStringControlType } from "../string/index.js"

export interface PartialTextProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  maxRenderLength?: number
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
  }
}

export interface FinalTextORM {
  sequelize: Required<PartialTextORM["sequelize"]>
}
