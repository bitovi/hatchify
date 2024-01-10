import type { PartialTextORM, PartialTextProps } from "./types.js"

export function getPartialOrm(
  props?: PartialTextProps<boolean>,
): PartialTextORM {
  return {
    sequelize: {
      type: "TEXT",
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
      defaultValue: props?.default,
      unique: props?.unique,
    },
  }
}
