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
  maxDisplayLength?: number
}

export interface PartialStringControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
  type: "String"
  min?: number
  max?: number
  regex?: RegExp
  maxDisplayLength?: number | null
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[], string> & {
    maxDisplayLength?: number
  }
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[], string>> & {
    maxDisplayLength: number | null
  }
}
