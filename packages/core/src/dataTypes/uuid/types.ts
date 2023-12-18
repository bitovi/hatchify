import type {
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"
import type { PartialStringControlType } from "../string"

export type PartialUuidProps<TRequired extends boolean> = PartialDataTypeProps<
  string,
  TRequired
> & {
  hidden?: boolean | null
}

export interface PartialUuidControlType<TRequired extends boolean>
  extends Omit<PartialStringControlType<TRequired>, "maxRenderLength"> {
  hidden: boolean | null
}

export interface PartialUuidORM {
  sequelize: Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
}

export interface FinalUuidORM {
  sequelize: Required<
    Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
  >
}
