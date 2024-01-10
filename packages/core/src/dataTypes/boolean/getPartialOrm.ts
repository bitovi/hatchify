import type { PartialBooleanORM, PartialBooleanProps } from "./types.js"

export function getPartialOrm(
  props?: PartialBooleanProps<boolean>,
): PartialBooleanORM {
  return {
    sequelize: {
      type: "BOOLEAN",
      allowNull: props?.required == null ? props?.required : !props.required,
      defaultValue: props?.default,
      unique: props?.unique,
    },
  }
}
