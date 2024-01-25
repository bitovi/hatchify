import type {
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types/index.js"
import type { PartialStringControlType } from "../string/index.js"

export type PartialUuidProps<TRequired extends boolean> = PartialDataTypeProps<
  string,
  TRequired
>

export type PartialUuidControlType<TRequired extends boolean> = Omit<
  PartialStringControlType<TRequired>,
  "maxRenderLength"
>

export interface PartialUuidORM {
  sequelize: Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
}

export interface FinalUuidORM {
  sequelize: Required<
    Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
  >
}
