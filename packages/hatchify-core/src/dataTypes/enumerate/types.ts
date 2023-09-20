import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialEnumProps extends PartialDataTypeProps<string> {
  values: string[]
}

export interface PartialEnumControlType extends PartialControlType<string> {
  type: "String"
  values: string[]
}

export interface PartialEnumORM {
  sequelize: PartialSequelizeDataType<string[], string>
}

export interface FinalEnumORM {
  sequelize: Required<PartialSequelizeDataType<string[], string>>
}
