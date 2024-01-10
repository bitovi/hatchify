import type { PartialDatetimeORM, PartialDatetimeProps } from "./types.js"

export function getPartialOrm(
  props?: PartialDatetimeProps<boolean>,
): PartialDatetimeORM {
  return {
    sequelize: {
      type: "DATE",
      typeArgs: [],
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
      defaultValue: props?.default,
      unique: props?.unique,
    },
  }
}
