import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialStringProps extends PartialDataTypeProps {
  min?: number
  max?: number
}

export interface PartialStringControlType extends PartialControlType<"String"> {
  type: "String"
  min?: number
  max?: number
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[]>
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[]>>
}
