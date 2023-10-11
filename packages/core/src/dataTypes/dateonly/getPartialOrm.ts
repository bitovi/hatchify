import type { PartialDateonlyORM, PartialDateonlyProps } from "./types"

export function getPartialOrm(
  props?: PartialDateonlyProps<boolean>,
): PartialDateonlyORM {
  return {
    sequelize: {
      type: "DATEONLY",
      typeArgs: [],
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
      defaultValue: props?.default,
    },
  }
}
