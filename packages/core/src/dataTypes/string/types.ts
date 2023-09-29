import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialStringProps extends PartialDataTypeProps<string> {
  min?: number
  max?: number
  regex?: RegExp
}

export interface PartialStringControlType extends PartialControlType<string> {
  type: "String"
  min?: number
  max?: number
  regex?: RegExp
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[], string>
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[], string>>
}
