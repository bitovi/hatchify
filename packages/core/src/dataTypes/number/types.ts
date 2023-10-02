import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialNumberProps extends PartialDataTypeProps<number> {
  autoIncrement?: boolean
  min?: number
  max?: number
  step?: number
}

export interface PartialNumberControlType extends PartialControlType<number> {
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
