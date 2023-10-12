import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export type PartialBooleanProps<TRequired extends boolean> = Omit<
  PartialDataTypeProps<boolean, TRequired>,
  "primary"
>

export interface PartialBooleanControlType<TRequired extends boolean>
  extends Omit<PartialControlType<boolean, TRequired>, "primary"> {
  type: "Boolean"
}

export interface PartialBooleanORM {
  sequelize: Omit<
    PartialSequelizeDataType<undefined, boolean>,
    "primaryKey" | "typeArgs" | "allowNullInfer"
  >
}

export interface FinalBooleanORM {
  sequelize: Required<
    Omit<
      PartialSequelizeDataType<undefined, boolean>,
      "primaryKey" | "typeArgs" | "allowNullInfer"
    >
  >
}
