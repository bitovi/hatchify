import { buildNumberValidation } from "./buildValidation"
import { calculateAllowNull } from "./calculateAllowNull"
import type {
  FinalNumberORM,
  PartialNumberORM,
  PartialNumberProps,
} from "../../types"

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
      type: "DOUBLE",
      typeArgs: [],
      allowNull: calculateAllowNull(finalize, props?.required, props?.primary),
      autoIncrement: finalize ? !!props?.autoIncrement : props?.autoIncrement,
      primaryKey: finalize ? !!props?.primary : props?.primary,
      ...buildNumberValidation(
        props?.min ?? props?.autoIncrement ? 1 : undefined,
        props?.max,
      ),
    },
  }
}
