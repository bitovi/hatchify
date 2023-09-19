import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialStringProps extends PartialDataTypeProps {
  min?: number
  max?: number
  regex?: RegExp
}

export interface PartialStringControlType extends PartialControlType {
  type: "String"
  min?: number
  max?: number
  regex?: RegExp
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[]>
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[]>>
}
