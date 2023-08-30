import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialEnumProps extends PartialDataTypeProps {
  values: string[]
}

export interface PartialEnumControlType extends PartialControlType {
  type: "String"
  values: string[]
}

export interface PartialEnumORM {
  sequelize: PartialSequelizeDataType<string[]>
}

export interface FinalEnumORM {
  sequelize: Required<PartialSequelizeDataType<string[]>>
}
