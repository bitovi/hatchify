import type { PartialNumberORM, PartialNumberProps } from "./types"

export function getPartialOrm(
  props?: PartialNumberProps<boolean>,
): PartialNumberORM {
  return {
    sequelize: {
      type: "DECIMAL",
      typeArgs: [],
      allowNull: props?.required == null ? props?.required : !props.required,
      autoIncrement: props?.autoIncrement,
      primaryKey: props?.primary,
      defaultValue: props?.default,
    },
  }
}
