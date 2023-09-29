import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialDateonlyProps extends PartialDataTypeProps<string> {
  min?: string | typeof Infinity
  max?: string | typeof Infinity
}

export interface PartialDateonlyControlType extends PartialControlType<string> {
  type: "Dateonly"
  min?: string | typeof Infinity
  max?: string | typeof Infinity
}

export interface PartialDateonlyORM {
  sequelize: PartialSequelizeDataType<number[], string>
}

export interface FinalDateonlyORM {
  sequelize: Required<PartialSequelizeDataType<number[], string>>
}
