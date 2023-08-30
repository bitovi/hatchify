import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialDatetimeProps extends PartialDataTypeProps {
  min?: Date | typeof Infinity
  max?: Date | typeof Infinity
  step?: "day" | number
}

export interface PartialDatetimeControlType extends PartialControlType {
  type: "Datetime"
  min?: Date | typeof Infinity
  max?: Date | typeof Infinity
  step?: "day" | number
}

export interface PartialDatetimeORM {
  sequelize: PartialSequelizeDataType<number[]>
}

export interface FinalDatetimeORM {
  sequelize: Required<PartialSequelizeDataType<number[]>>
}
