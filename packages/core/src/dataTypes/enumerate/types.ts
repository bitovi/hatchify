import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialEnumProps
  extends PartialDataTypeProps<string, boolean> {
  values: string[]
}

export interface PartialEnumControlType
  extends PartialControlType<string, boolean> {
  type: "enum"
  values: string[]
}

export interface PartialEnumORM {
  sequelize: PartialSequelizeDataType<string[], string>
}

export interface FinalEnumORM {
  sequelize: Required<PartialSequelizeDataType<string[], string>>
}
