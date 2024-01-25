import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types/index.js"

export type PartialBooleanProps<TRequired extends boolean> =
  PartialDataTypeProps<boolean, TRequired>

export interface PartialBooleanControlType<TRequired extends boolean>
  extends PartialControlType<boolean, TRequired> {
  type: "Boolean"
}

export interface PartialBooleanORM {
  sequelize: Omit<PartialSequelizeDataType<undefined, boolean>, "typeArgs">
}

export interface FinalBooleanORM {
  sequelize: Required<
    Omit<PartialSequelizeDataType<undefined, boolean>, "typeArgs">
  >
}
