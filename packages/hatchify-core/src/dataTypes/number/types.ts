import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialNumberProps extends PartialDataTypeProps {
  autoIncrement?: boolean
  min?: number
  max?: number
  step?: number
}

export interface PartialNumberControlType extends PartialControlType {
  type: "Number"
  min?: number
  max?: number
  step?: number
}

export interface PartialNumberORM {
  sequelize: PartialSequelizeDataType<number[]> & {
    autoIncrement?: boolean
  }
}

export interface FinalNumberORM {
  sequelize: Required<PartialSequelizeDataType<number[]>> & {
    autoIncrement: boolean
  }
}
