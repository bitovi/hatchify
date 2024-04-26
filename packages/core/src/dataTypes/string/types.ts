import type {
  HatchifyBaseUIOptions,
  PartialControlType,
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types/index.js"

export interface HatchifyStringUIOptions extends HatchifyBaseUIOptions {
  maxDisplayLength?: number | null
  enableCaseSensitiveContains?: boolean
}

export interface PartialStringProps<TRequired extends boolean>
  extends PartialDataTypeProps<string, TRequired> {
  min?: number
  max?: number
  regex?: RegExp
  ui?: HatchifyStringUIOptions
}

export interface PartialStringControlType<TRequired extends boolean>
  extends PartialControlType<string, TRequired> {
  type: "String"
  min?: number
  max?: number
  regex?: RegExp
  ui?: HatchifyStringUIOptions
}

export interface PartialStringORM {
  sequelize: PartialSequelizeDataType<number[] | string[], string>
}

export interface FinalStringORM {
  sequelize: Required<PartialSequelizeDataType<number[] | string[], string>>
}
