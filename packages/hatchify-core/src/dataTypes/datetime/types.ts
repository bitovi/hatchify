import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialDatetimeProps extends PartialDataTypeProps<Date> {
  min?: Date | typeof Infinity
  max?: Date | typeof Infinity
  step?: "day" | number
}

export interface PartialDatetimeControlType extends PartialControlType<Date> {
  type: "Datetime"
  min?: Date | typeof Infinity
  max?: Date | typeof Infinity
  step?: "day" | number
}

export interface PartialDatetimeORM {
  sequelize: PartialSequelizeDataType<number[], Date>
}

export interface FinalDatetimeORM {
  sequelize: Required<PartialSequelizeDataType<number[], Date>>
}
