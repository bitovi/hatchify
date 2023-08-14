import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "./generic"

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

export interface SequelizeNumberValidation {
  validate?: {
    min?: number
    max?: number
  }
}

export interface PartialNumberORM {
  sequelize: PartialSequelizeDataType<number[]> &
    Required<SequelizeNumberValidation>
}

export interface FinalNumberORM {
  sequelize: Required<PartialSequelizeDataType<number[]>> &
    SequelizeNumberValidation
}
