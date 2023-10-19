import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export type PartialUuidProps<TRequired extends boolean> = PartialDataTypeProps<
  string,
  TRequired
>

export interface PartialUuidControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
  type: "String"
}

export interface PartialUuidORM {
  sequelize: Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
}

export interface FinalUuidORM {
  sequelize: Required<
    Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
  >
}
