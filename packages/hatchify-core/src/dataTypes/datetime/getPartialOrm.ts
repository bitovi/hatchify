import type { PartialDatetimeORM, PartialDatetimeProps } from "./types"

export function getPartialOrm(
  props?: PartialDatetimeProps,
): PartialDatetimeORM {
  return {
    sequelize: {
      type: "DATE",
      typeArgs: [],
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
    },
  }
}
