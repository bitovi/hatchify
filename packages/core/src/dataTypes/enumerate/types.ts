import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialEnumProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  values: string[]
}

export interface PartialEnumControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
  type: "enum"
  values: string[]
}

export interface PartialEnumORM {
  sequelize: PartialSequelizeDataType<string[], string>
}

export interface FinalEnumORM {
  sequelize: Required<PartialSequelizeDataType<string[], string>>
}
