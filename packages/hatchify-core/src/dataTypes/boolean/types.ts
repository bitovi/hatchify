import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export type PartialBooleanProps = Omit<PartialDataTypeProps, "primary">

export interface PartialBooleanControlType
  extends Omit<PartialControlType, "primary"> {
  type: "Boolean"
}

export interface PartialBooleanORM {
  sequelize: Omit<
    PartialSequelizeDataType<undefined>,
    "primaryKey" | "typeArgs"
  >
}

export interface FinalBooleanORM {
  sequelize: Required<
    Omit<PartialSequelizeDataType<undefined>, "primaryKey" | "typeArgs">
  >
}
