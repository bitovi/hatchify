import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export type PartialUuidProps = PartialDataTypeProps<string>

export interface PartialUuidControlType extends PartialControlType<string> {
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
