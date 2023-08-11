import type {
  FinalNumberORM,
  PartialNumberORM,
  PartialNumberProps,
} from "../../types"
import { buildNumberValidation } from "../number/buildValidation"
import { calculateAllowNull } from "../number/calculateAllowNull"

export function getOrm(
  finalize: true,
  props?: PartialNumberProps,
): FinalNumberORM

export function getOrm(
  finalize: boolean,
  props?: PartialNumberProps,
): PartialNumberORM | FinalNumberORM

export function getOrm(
  finalize: boolean,
  props?: PartialNumberProps,
): PartialNumberORM | FinalNumberORM {
  return {
    sequelize: {
      type: "INTEGER",
      typeArgs: [],
      allowNull: calculateAllowNull(finalize, props?.required, props?.primary),
      autoIncrement: finalize ? !!props?.autoIncrement : props?.autoIncrement,
      primaryKey: finalize ? !!props?.primary : props?.primary,
      ...buildNumberValidation(props?.min, props?.max),
    },
  }
}
