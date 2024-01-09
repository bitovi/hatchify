import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types/index.js"

export interface PartialDateonlyProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  min?: string | typeof Infinity
  max?: string | typeof Infinity
}

export interface PartialDateonlyControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
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
