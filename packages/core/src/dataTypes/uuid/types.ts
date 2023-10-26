import type {
  PartialDataTypeProps,
  PartialSequelizeDataType,
} from "../../types"
import { PartialStringControlType } from "../string"

export type PartialUuidProps<TRequired extends boolean> = PartialDataTypeProps<
  string,
  TRequired
> & {
  references?: string | null
}

export interface PartialUuidControlType<TRequired extends boolean>
  extends PartialStringControlType<TRequired> {
  references: string | null
}

export interface PartialUuidORM {
  sequelize: Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
}

export interface FinalUuidORM {
  sequelize: Required<
    Omit<PartialSequelizeDataType<undefined, string>, "typeArgs">
  >
}
