import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export type PartialBooleanProps = Omit<PartialDataTypeProps<boolean>, "primary">

export interface PartialBooleanControlType
  extends Omit<PartialControlType<boolean>, "primary"> {
  type: "Boolean"
}

export interface PartialBooleanORM {
  sequelize: Omit<
    PartialSequelizeDataType<undefined, boolean>,
    "primaryKey" | "typeArgs"
  >
}

export interface FinalBooleanORM {
  sequelize: Required<
    Omit<
      PartialSequelizeDataType<undefined, boolean>,
      "primaryKey" | "typeArgs"
    >
  >
}
