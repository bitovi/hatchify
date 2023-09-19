import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialDateonlyProps extends PartialDataTypeProps {
  min?: string | typeof Infinity
  max?: string | typeof Infinity
}

export interface PartialDateonlyControlType extends PartialControlType {
  type: "Dateonly"
  min?: string | typeof Infinity
  max?: string | typeof Infinity
}

export interface PartialDateonlyORM {
  sequelize: PartialSequelizeDataType<number[]>
}

export interface FinalDateonlyORM {
  sequelize: Required<PartialSequelizeDataType<number[]>>
}
