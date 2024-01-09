import type { PartialStringControlType, PartialStringProps } from "../string"

export type PartialTextProps<TRequired extends boolean> =
  PartialStringProps<TRequired>

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
