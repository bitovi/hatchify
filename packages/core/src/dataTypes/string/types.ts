import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialStringProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  min?: number
  max?: number
  regex?: RegExp
  displayName?: string
  maxRenderLength?: number
}

export interface PartialStringControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
  type: "String"
  min?: number
  max?: number
  regex?: RegExp
  maxRenderLength?: number | null
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[], string>
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[], string>>
}
