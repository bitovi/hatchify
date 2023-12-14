import type { PartialStringORM, PartialStringProps } from "./types"

export function getPartialOrm(
  props?: PartialStringProps<boolean>,
): PartialStringORM {
  return {
    sequelize: {
      type: "STRING",
      typeArgs: props?.max == null || props.max === Infinity ? [] : [props.max],
      allowNull: props?.required == null ? props?.required : !props.required,
      primaryKey: props?.primary,
      defaultValue: props?.default,
      unique: props?.unique,
    },
  }
}
