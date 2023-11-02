import type {
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"

export interface PartialEnumProps<
  TRequired extends boolean,
  TValues extends readonly string[],
> extends PartialDataTypeProps<string, TRequired> {
  values: TValues
}

export interface PartialEnumControlType<
  TRequired extends boolean,
  TValues extends readonly string[],
> extends PartialControlType<string, TRequired> {
  type: "enum"
  values: TValues
}

export interface PartialEnumORM {
  sequelize: PartialSequelizeDataType<string[], string>
}

export interface FinalEnumORM {
  sequelize: Required<PartialSequelizeDataType<string[], string>>
}
