import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialDatetimeProps<TRequired extends boolean>
  extends PartialDataTypeProps<Date, TRequired> {
  min?: Date | typeof Infinity
  max?: Date | typeof Infinity
  step?: "day" | number
}

export interface PartialDatetimeControlType<TRequired extends boolean>
  extends PartialControlType<Date, TRequired> {
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
