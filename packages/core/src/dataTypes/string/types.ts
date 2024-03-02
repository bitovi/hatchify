import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types/index.js"

export interface PartialStringProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  min?: number
  max?: number
  regex?: RegExp
  maxRenderLength?: number
  ui?: {
    enableCaseSensitiveContains?: boolean
  }
}

export interface PartialStringControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
  type: "String"
  min?: number
  max?: number
  regex?: RegExp
  maxRenderLength?: number | null
  ui?: {
    enableCaseSensitiveContains?: boolean
  }
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[], string>
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[], string>>
}
