import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export type PartialUuidProps = PartialDataTypeProps

export interface PartialUuidControlType extends PartialControlType {
  type: "String"
}

export interface PartialUuidORM {
  sequelize: Omit<PartialSequelizeDataType<undefined>, "typeArgs">
}

export interface FinalUuidORM {
  sequelize: Required<Omit<PartialSequelizeDataType<undefined>, "typeArgs">>
}
