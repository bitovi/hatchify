import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialNumberProps<TRequired extends boolean>
  extends PartialDataTypeProps<number, TRequired> {
  autoIncrement?: boolean
  min?: number
  max?: number
  step?: number
}

export interface PartialNumberControlType<TRequired extends boolean>
  extends PartialControlType<number, TRequired> {
  type: "Number"
  min?: number
  max?: number
  step?: number
}

export interface PartialNumberORM {
  sequelize: PartialSequelizeDataType<number[], number> & {
    autoIncrement?: boolean
  }
}

export interface FinalNumberORM {
  sequelize: Required<PartialSequelizeDataType<number[], number>> & {
    autoIncrement: boolean
  }
}
